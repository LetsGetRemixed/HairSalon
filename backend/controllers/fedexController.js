const axios = require("axios");
require("dotenv").config();

const FEDEX_OAUTH_URL = 'https://apis-sandbox.fedex.com/oauth/token';
const FEDEX_API_URL = 'https://apis-sandbox.fedex.com/rate/v1/rates/quotes';

const FEDEX_SECRET_KEY='a492ff6136d4427f936d9c87f15d3997';

// Function to fetch a valid FedEx token
async function getFedexToken() {
  try {
    const response = await axios.post(FEDEX_OAUTH_URL, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.FEDEX_API_KEY,
      client_secret: process.env.FEDEX_SECRET_KEY
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch FedEx token: ${response.status} - ${response.statusText}`);
    }
    return response.data.access_token;
  } catch (error) {
    console.error('Error obtaining FedEx token:', error.message);
    throw new Error('Unable to authenticate with FedEx API.');
  }
}

// Controller function for calculating shipping costs
exports.calculateShippingCost = async (req, res) => {
  const { origin, destination, weight, dimensions, serviceType } = req.body;

  const fedexRequest = {
    accountNumber: {
      value: process.env.FEDEX_ACCOUNT_NUMBER
    },
    rateRequestControlParameters: {
      returnTransitTimes: false,
      servicesNeededOnRateFailure: true,
      variableOptions: "FREIGHT_GUARANTEE",
      rateSortOrder: "SERVICENAMETRADITIONAL"
    },
    requestedShipment: {
      shipper: {
        address: {
          streetLines: [origin.street],
          city: origin.city,
          stateOrProvinceCode: origin.state,
          postalCode: origin.zip,
          countryCode: origin.country
        }
      },
      recipient: {
        address: {
          streetLines: [destination.street],
          city: destination.city,
          stateOrProvinceCode: destination.state,
          postalCode: destination.zip,
          countryCode: destination.country,
          residential: destination.residential || false
        }
      },
      serviceType: serviceType || "STANDARD_OVERNIGHT",
      preferredCurrency: "USD",
      rateRequestType: ["LIST", "ACCOUNT"],
      shipDateStamp: new Date().toISOString().split('T')[0],
      pickupType: "DROPOFF_AT_FEDEX_LOCATION",
      requestedPackageLineItems: [
        {
          weight: {
            units: "LB",
            value: weight
          },
          dimensions: {
            length: dimensions.length,
            width: dimensions.width,
            height: dimensions.height,
            units: "IN"
          }
        }
      ],
      packagingType: "YOUR_PACKAGING",
      totalPackageCount: 1
    },
    carrierCodes: ["FDXE", "FDXG"]
  };

  try {
    const token = await getFedexToken();

    const response = await axios.post(FEDEX_API_URL, fedexRequest, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.data.output || !response.data.output.rateReplyDetails) {
      throw new Error(`Unexpected FedEx API response: ${JSON.stringify(response.data)}`);
    }

    const results = response.data.output.rateReplyDetails.map(detail => ({
      courier: 'FedEx',
      cost: detail.ratedShipmentDetails?.[0]?.totalNetCharge || "N/A",  // This correctly accesses totalNetCharge
      service: detail.serviceType || "Unknown",
      transitTime: detail.commitDetails?.[0]?.commitTimestamp || "Unknown"
  }));
    //console.log('Full FedEx Response:', JSON.stringify(response.data, null, 2));

    res.json({ success: true, results });
  } catch (error) {
    console.error('Error fetching FedEx rates:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};