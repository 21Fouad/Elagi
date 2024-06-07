import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';
import i18n from './i18n';
import axios from 'axios';
import './index.css';
import Navbar from './Components/Navbar/Navbar';
import Register from './Components/Register/Register';
import OTP from './Components/OTP/OTP';
import Login from './Components/Login/Login';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import Home from './Components/Home/Home';
import Profile from './Components/Profile/Profile';
import Footer from './Components/Footer/Footer';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import Categories from './Components/Categories/Categories';
import Help from './Components/Help&Faq/Help';
import NotFound from './Components/NotFound/NotFound';
import Term from './Components/terms&conditions/Term';
import Prescription from './Components/prescription/Prescription';
import ChatbotComponent from './Components/cahtBot/ChatBot';
import LiveChatComponent from './Components/liveChat/LiveChat';
import Products from './Components/Products/Products';
import ProductDetail from './Components/ProductDetail/ProductDetail';
import Favourite from './Components/Favourite/Favourite';
import ScrollToTop from './Components/Arrow/ScrollToTop';
import Features from './Components/Features/Features';
import Donation from './Components/Donation/Donation';
import MedicalTest from './Components/Medical Test/MedicalTest';
import PaymentIframe from './Components/Donation/Donation';
import Cart from './Components/Cart/Cart';
import Checkout from './Components/Checkout/CheckOut';
import OrdersPage from './Components/Order/Order';
import RareMedicine from './Components/RareMedicine/RareMedicine';
import PaymentResultPage from './Components/PaymobRes/paymob';
import FeedbackForm from './Components/feedback/Feedback';
import { CartProvider } from './Components/CartContext';
import { AuthProvider } from './Components/AuthContext';
import { FavoritesProvider } from './Components/FavoritesContext';



axios.interceptors.request.use((config) => {
  const language = i18n.language;
  config.headers['Accept-Language'] = language;
  return config;
});


export default function App() {
  return (
    <div>
      <CartProvider>
        <AuthProvider>
          <FavoritesProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms" element={<Term />} />
            <Route path="/OTP" element={<OTP />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forget" element={<ForgetPassword />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Categories" element={<Categories />} />
            <Route path="/products/category/:categorySlug" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/feedback" element={<FeedbackForm />} />
            <Route path="/help" element={<Help />} />
            <Route path="/medicines" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/medicines/:productId" element={<ProductDetail />} />
            <Route path="/order" element={<OrdersPage />} />
            <Route path="/features/rareMedicine" element={<RareMedicine />} />
            <Route path="/favorite" element={<Favourite />} />
            <Route path="/features" element={<Features />} />
              <Route path="/features/chatBot" element={<ChatbotComponent />} />
              <Route path="/features/medicalTest" element={<MedicalTest />} />
              <Route path="/features/prescription" element={<Prescription />} />
              <Route path="/features/donation" element={<Donation />} />
              <Route path="/donation" element={<PaymentIframe />}/>          
              <Route path="/checkout" element={<Checkout />}/>    
              <Route path="/payment-result" component={PaymentResultPage} />      
            <Route path="/prescription" element={<Prescription />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotComponent/>
          <LiveChatComponent />
          <ScrollToTop />
          <Footer />
        </Router>
        </FavoritesProvider>
        </AuthProvider>
      </CartProvider>
    </div>
  );
}
