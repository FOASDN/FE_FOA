import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useCart } from "./hooks/useCart";
import HomePage from "./pages/Home";
import VouchersPage from "./pages/Vouchers";
import VoucherDetailPage from "./pages/VoucherDetail";
import MenuPage from "./pages/Menu";
import FoodDetailPage from "./pages/FoodDetail";
import ShoppingCartPage from "./pages/ShoppingCart";
import CheckoutPage from "./pages/Checkout";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import VerifyEmailPage from "./pages/Register/VerifyEmail";
import ForgotPasswordPage from "./pages/ForgotPassword";
import ResetPasswordPage from "./pages/ResetPassword";
import OnboardingPage from "./pages/Onboarding";
import RequireAuth from "./components/guards/RequireAuth";
import RequireRole from "./components/guards/RequireRole";
import ProfileLayout from "./pages/Profile/ProfileLayout";
import ProfileSettingsPage from "./pages/ProfileSettings";
import OrderHistoryTabContent from "./pages/OrderHistory/OrderHistoryTab";
import VoucherWalletProfilePage from "./pages/Profile/VoucherWallet";
import AddressesPage from "./pages/Addresses";
import SafeAlternativesPage from "./pages/SafeAlternatives";
import VoucherWalletPage from "./pages/VoucherWallet";
import MembershipBenefitsPage from "./pages/MembershipBenefits";
import OrderRatingPage from "./pages/OrderRating";
import OrderSuccessPage from "./pages/OrderSuccess";
import OrderDetailPage from "./pages/OrderDetail";
import TrackOrderPage from "./pages/TrackOrder";
import AboutPage from "./pages/About";
import NotFoundPage from "./pages/NotFound";
import ForbiddenPage from "./pages/Forbidden";
import MainLayout from "./components/layout/MainLayout";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminMenuManagement from "./pages/Admin/MenuManagement";
import AdminOrders from "./pages/Admin/Orders";
import AdminVouchers from "./pages/Admin/Vouchers";
import AdminSettings from "./pages/Admin/Settings";
import AdminCustomers from "./pages/Admin/Customers";
// import AdminAnalytics from "./pages/Admin/Analytics";
import AdminInventory from "./pages/Admin/Inventory";
import AdminStaff from "./pages/Admin/Staff";
import AdminReviews from "./pages/Admin/Reviews";
import AdminDelivery from "./pages/Admin/Delivery";
import AdminDispatch from "./pages/Admin/Dispatch";
import AdminIngredients from "./pages/Admin/Ingredients";
import StaffLayout from "./components/layout/StaffLayout";
import StaffDashboard from "./pages/Staff/Dashboard";
import StaffOrders from "./pages/Staff/Orders";
import StaffMenu from "./pages/Staff/Menu";
import StaffCustomerProfile from "./pages/Staff/CustomerProfile";

function App() {
  const { hydrate } = useAuth();
  const { hydrate: hydrateCart } = useCart();

  useEffect(() => {
    hydrate();
    hydrateCart();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/vouchers" element={<VouchersPage />} />
          <Route path="/vouchers/:id" element={<VoucherDetailPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/food/:id" element={<FoodDetailPage />} />
          {/* Protected customer routes */}
          <Route element={<RequireAuth />}>
            <Route path="/cart" element={<ShoppingCartPage />} />
            {/* /checkout requires auth — unauthenticated users redirect to login */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfileLayout />}>
              <Route index element={<ProfileSettingsPage />} />
              <Route path="history" element={<OrderHistoryTabContent />} />
              <Route path="wallet" element={<VoucherWalletProfilePage />} />
            </Route>
            <Route
              path="/history"
              element={<Navigate to="/profile/history" replace />}
            />
            <Route path="/addresses" element={<AddressesPage />} />
            <Route path="/ai-suggestions" element={<SafeAlternativesPage />} />
            <Route path="/wallet" element={<VoucherWalletPage />} />
            <Route path="/membership" element={<MembershipBenefitsPage />} />
            <Route path="/rating/:orderId" element={<OrderRatingPage />} />
            <Route path="/success" element={<OrderSuccessPage />} />
            <Route path="/order-detail/:id" element={<OrderDetailPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        {/* Staff — protected by role */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole allowedRoles={["STAFF", "ADMIN"]} />}>
            <Route path="/staff" element={<StaffLayout />}>
              <Route index element={<StaffDashboard />} />
              <Route path="orders" element={<StaffOrders />} />
              <Route path="menu" element={<StaffMenu />} />
              <Route path="customers" element={<StaffCustomerProfile />} />
              <Route path="customers/:id" element={<StaffCustomerProfile />} />
              <Route path="*" element={<Navigate to="/staff" replace />} />
            </Route>
          </Route>
        </Route>
        {/* Admin — protected by role */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/overview" replace />} />
              <Route path="overview" element={<AdminDashboard />} />
              <Route path="menu" element={<AdminMenuManagement />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="staff" element={<AdminStaff />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="delivery" element={<AdminDelivery />} />
              <Route path="vouchers" element={<AdminVouchers />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="dispatch" element={<AdminDispatch />} />
              <Route path="ingredients" element={<AdminIngredients />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Route>
          </Route>
        </Route>
        {/* Error pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        {/* Catch-all 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
