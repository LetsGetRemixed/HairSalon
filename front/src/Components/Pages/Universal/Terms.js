import React from 'react';
import Navbar from './Navbar2';
import Footer from './Footer';

const TermsOfService = () => {
  return (
    <div>

    <Navbar />
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Terms of Service</h1>

      <p className="mb-4">
        Welcome to Bold Hair Co ("we," "our," "us"). By accessing or using our website, boldhairco.com ("Website"), you agree to comply with these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Website.
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Accounts</h2>
      <p className="mb-4">
        Accounts on the Website are available to anyone; however, the ability to purchase products is restricted to licensed stylists. Users are responsible for maintaining the confidentiality of their account credentials. Providing false information may result in the termination of your account.
      </p>

      <h2 className="text-2xl font-semibold mb-4">2. Product Descriptions and Orders</h2>
      <p className="mb-4">
        Products are described as they are sold. Any inaccuracies or changes in availability will be communicated to users. We reserve the right to refuse or cancel orders at our discretion. Users will be notified via email in the event of a cancellation or change.
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Pricing and Payments</h2>
      <p className="mb-4">
        Prices are subject to change without notice. Taxes and fees are handled by Bold Hair Co. Payments are exclusively processed through Stripe, which accepts all payment methods supported by Stripe.
      </p>

      <h2 className="text-2xl font-semibold mb-4">4. Shipping</h2>
      <p className="mb-4">
        Orders are shipped via FedEx, and users are responsible for covering shipping costs. There are no limitations on shipping regions.
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Returns and Refunds</h2>
      <p className="mb-4">
        We offer refunds or returns for incorrect products received. To initiate a return or refund, please contact our support team at support@boldhairco.com.
      </p>

      <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
      <p className="mb-4">
        Attempting to purchase items without being a licensed stylist is unauthorized. Violations of these Terms may result in the deletion of your account.
      </p>

      <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
      <p className="mb-4">
        Bold Hair Co owns all content, trademarks, and branding on the Website. Users are not permitted to copy or reproduce any content without prior written consent.
      </p>

      <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Liability</h2>
      <p className="mb-4">
        We are not responsible for product misuse or order delays. All products are sold "as is" without warranties unless explicitly stated otherwise.
      </p>

      <h2 className="text-2xl font-semibold mb-4">9. Governing Law and Dispute Resolution</h2>
      <p className="mb-4">
        These Terms are governed by the laws of the United States. Any disputes will be resolved through the default dispute resolution methods provided by applicable laws.
      </p>

      <h2 className="text-2xl font-semibold mb-4">10. Updates to Terms</h2>
      <p className="mb-4">
        These Terms may be updated from time to time. Any changes will be posted on this page. Users are encouraged to review the Terms periodically.
      </p>

      <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
      <p className="mb-4">
        For questions or concerns about these Terms, please contact us at:
      </p>
      <p className="mb-4 font-semibold">Email: support@boldhairco.com</p>

      <h2 className="text-2xl font-semibold mb-4">12. Stylist Verification</h2>
      <p className="mb-4">
        Licensed stylists are required to verify their license during account creation for purchase eligibility.
      </p>
    </div>
    
        <Footer />

    </div>
  );
};

export default TermsOfService;
