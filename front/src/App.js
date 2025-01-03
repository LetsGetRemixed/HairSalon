import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/Pages/Home/Home';
import About from './Components/Pages/About/About';
import Checkout from './Components/Pages/Checkout/Checkout';
import SingleProduct from './Components/Pages/Products/SingleProduct';
import Login from './Components/Pages/Account/Login';
import Register from './Components/Pages/Account/Register';
import Account from './Components/Pages/Account/Account';
import { AuthProvider } from './Components/Pages/Account/AuthContext';
import { SubscriptionProvider } from './Components/Pages/Sucbription/SubscriptionContext';
import SubscriptionPage from './Components/Pages/Sucbription/SubscriptionPage';
import { CartProvider } from './Components/Pages/Checkout/CartContext';
import Cart from './Components/Pages/Checkout/Cart';
import AdminDashboard from './Components/Admin/AdminDashboard';
import Users from './Components/Admin/users';
import Subscriptions from './Components/Admin/subscriptions';
import Transactions from './Components/Admin/transactions';
import ProductInventory from './Components/Admin/inventory';
import ProtectedRoute from './Components/Admin/ProtectedRoute';
import { AdminAuthProvider } from './Components/Admin//AdminAuthProvider';
import AdminLogin from './Components/Admin/AdminLogin';
import Info from './Components/Admin/Info';

import LicenseUpload from './Components/Pages/Sucbription/License';
import SubCheckout from './Components/Pages/Sucbription/SubscriptionCheckoutForm';
import PendingLicense from './Components/Admin/PendingLicense';
import Contact from './Components/Pages/Contact/Contact';
import ShippingOrders from './Components/Admin/ShippingOrders';
import PrivacyPolicy from './Components/Pages/Universal/PrivacyPolicy';
import TermsOfService from './Components/Pages/Universal/Terms';

function App() {
  return (
    <AdminAuthProvider>
    <AuthProvider>
        <SubscriptionProvider>
            <CartProvider>
                <Router>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/terms" element={<TermsOfService />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path='/checkout' element={<Checkout/>} />
                    <Route path="/product/:id" element={<SingleProduct />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/subscribe" element={<SubscriptionPage />} />
                    <Route path="/subcheckout" element={<SubCheckout />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/adminlogin" element={<AdminLogin />} />
                    <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
                    <Route path="/admin/subscriptions" element={<ProtectedRoute><Subscriptions /></ProtectedRoute>} />
                    <Route path="/admin/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                    <Route path="/admin/inventory" element={<ProtectedRoute><ProductInventory /></ProtectedRoute>} />
                    <Route path="/admin/pending-license" element={<ProtectedRoute><PendingLicense/></ProtectedRoute>} />
                    <Route path="/admin/unfulfilled-orders" element={<ProtectedRoute><ShippingOrders/></ProtectedRoute>} />
                    <Route path="/admin/info" element={<ProtectedRoute><Info /></ProtectedRoute>} />
                    <Route path='/license' element={<LicenseUpload />} />
                  </Routes>
                </Router>
            </CartProvider>
       </SubscriptionProvider>
    </AuthProvider>
    </AdminAuthProvider>
  );
}
export default App;

