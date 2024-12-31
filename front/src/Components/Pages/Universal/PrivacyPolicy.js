import React from 'react';
import Navbar from './Navbar2';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div>
        <Navbar />
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>

      <p className="mb-4">
        This Privacy Policy explains how Bold Hair ("we," "our," "us") collects, uses, and protects the personal information of licensed stylists who use our website, boldhairco.com ("Website").
      </p>

      <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
      <p className="mb-4">
        We collect the following personal information from users:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Shipping address</li>
        <li>Billing information (processed directly by Stripe; not stored on our servers)</li>
        <li>Account information (user profiles and account creation details)</li>
        <li>Order and payment history</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">2. How We Collect Information</h2>
      <p className="mb-4">
        Information is collected directly through forms filled out by users on our Website, including during account creation, checkout, and order processing.
      </p>

      <h2 className="text-2xl font-semibold mb-4">3. Purpose of Data Collection</h2>
      <p className="mb-4">
        We collect personal information to:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Process and fulfill orders</li>
        <li>Communicate with users regarding orders, accounts, and updates</li>
        <li>Maintain user account information for licensed stylists</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Retention</h2>
      <p className="mb-4">
        All data is securely stored using Firebase Cloud Services and MongoDB. We retain personal information for a period of five (5) years unless users request deletion.
      </p>

      <h2 className="text-2xl font-semibold mb-4">5. Security Measures</h2>
      <p className="mb-4">
        We implement the following security measures:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Encryption using GitHub secrets for password protection</li>
        <li>Secure Stripe checkout for payment processing</li>
        <li>Access control to restrict unauthorized access to sensitive information</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">6. Sharing of Information</h2>
      <p className="mb-4">
        We only share personal information with the following third parties:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Stripe for payment processing</li>
        <li>Firebase Cloud Services and MongoDB for data storage</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">7. User Rights</h2>
      <p className="mb-4">
        Users have the following rights regarding their personal information:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Delete their accounts by contacting us via email</li>
        <li>Unsubscribe from communications using the unsubscribe button</li>
        <li>Cancel orders by emailing us</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">8. Policy Updates</h2>
      <p className="mb-4">
        Any updates to this Privacy Policy will be posted on this page. Users are encouraged to review the policy periodically for any changes.
      </p>

      <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
      <p className="mb-4">
        For questions or concerns about this Privacy Policy, please contact us at:
      </p>
      <p className="mb-4 font-semibold">Email: support@boldhairco.com</p>
    </div>
    <Footer />
    </div>
  );
};

export default PrivacyPolicy;
