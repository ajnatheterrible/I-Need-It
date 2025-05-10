import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Favorites from "./pages/Favorites";
import Sell from "./pages/Sell";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Purchases from "./pages/Purchases";
import SearchResults from "./pages/SearchResults";
import Listing from "./pages/Listing";
import Checkout from "./pages/Checkout";
import ProfileSettings from "./pages/ProfileSettings";
import Addresses from "./pages/Addresses";
import Sizes from "./pages/Sizes";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Accessibility from "./pages/Accessibility";
import ContactUs from "./pages/ContactUs";
import Designers from "./pages/Designers";
import ForSale from "./pages/ForSale";
import Feedback from "./pages/Feedback";
import Drafts from "./pages/Drafts";
import Sold from "./pages/Sold";
import PaymentsSeller from "./pages/PaymentsSeller";
import SellerSettings from "./pages/SellerSettings";
import UserLayout from "./components/UserLayout";
import UserFavorites from "./pages/UserFavorites";
import UserReviews from "./pages/UserReviews";

export default function App() {
  return (
    <Routes>
      {/* Routes wrapped in Layout (includes Navbar) */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="sell" element={<Sell />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<UserLayout />}>
          <Route index element={<Profile />} />
          <Route path="favorites" element={<UserFavorites />} />
          <Route path="reviews" element={<UserReviews />} />
        </Route>
        <Route path="purchases" element={<Purchases />} />
        <Route path="search-results" element={<SearchResults />} />
        <Route path="listing" element={<Listing />} />
        <Route path="profile-settings" element={<ProfileSettings />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="sizes" element={<Sizes />} />
        <Route path="payments" element={<Payments />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Help />} />
        <Route path="about" element={<About />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="accessibility" element={<Accessibility />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="designers" element={<Designers />} />
        <Route path="for-sale" element={<ForSale />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="sold" element={<Sold />} />
        <Route path="drafts" element={<Drafts />} />
        <Route path="payments-seller" element={<PaymentsSeller />} />
        <Route path="settings-seller" element={<SellerSettings />} />

        {/* Catch-all for unknown paths */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Standalone route with no layout */}
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}
