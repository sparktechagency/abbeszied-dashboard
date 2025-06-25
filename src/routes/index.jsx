import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home/Home";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy/PrivacyPolicy.jsx";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition/TermsAndCondition";
import Transaction from "../Pages/Dashboard/Transaction/Transaction.jsx";
import Setting from "../Pages/Dashboard/Setting/Setting.jsx";
import FaqCollapse from "../Pages/Dashboard/FAQ/FaqCollapse.jsx";
import Contact from "../Pages/Dashboard/Contact/Contact.jsx";
import PushNotification from "../Pages/Dashboard/PushNotification/PushNotification.jsx";
import BookingList from "../Pages/Dashboard/Booking/BookingList.jsx";
import SpecificService from "../Pages/Dashboard/DyanamicPage/SpecificService.jsx";
import SupportChat from "../Pages/Dashboard/SupportChat/SupportChat.jsx";
import ChatRoom from "../Pages/Dashboard/SupportChat/ChatRoom.jsx";
import TraineeList from "../Pages/Dashboard/Trainee/TraineeList.jsx";
import CoachList from "../Pages/Dashboard/Coach/CoachList.jsx";
import CorporateList from "../Pages/Dashboard/CorporateList/CorporateList.jsx";
import CertificateList from "../Pages/Dashboard/CertificateReview/CertificateList.jsx";
import Category from "../Pages/Dashboard/Categoty/Category.jsx";
import Users from "../Pages/Dashboard/User/Users.jsx";
import PendingProducts from "../Pages/Dashboard/PendingProducts/PendingProducts.jsx";
import ProductList from "../Pages/Dashboard/ProductList/ProductList.jsx";
import AboutUs from "../Pages/Dashboard/AboutUs/AboutUs.jsx";
import Slider from "../Pages/Dashboard/Slider/Slider.jsx";
import CoachSlider from "../Pages/Dashboard/CoachSlider/CoachSlider.jsx";
import CorporateSlider from "../Pages/Dashboard/CorporateSlider/CorporateSlider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
const router = createBrowserRouter([
  {
    path: "/",

    element: <Main />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },

      {
        path: "/coach-list",
        element: (
          <ProtectedRoute>
            <CoachList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/certificate-review",
        element: (
          <ProtectedRoute>
            <CertificateList />
          </ProtectedRoute>
        ),
      },

      {
        path: "/transaction",
        element: (
          <ProtectedRoute>
            <Transaction />,
          </ProtectedRoute>
        ),
      },
      {
        path: "/category",
        element: (
          <ProtectedRoute>
            <Category />
          </ProtectedRoute>
        ),
      },
      {
        path: "/corporate-list",
        element: (
          <ProtectedRoute>
            <CorporateList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/trainee-list",
        element: (
          <ProtectedRoute>
            <TraineeList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/booking-list",
        element: (
          <ProtectedRoute>
            <BookingList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/pending-products",
        element: (
          <ProtectedRoute>
            <PendingProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/product-list",
        element: (
          <ProtectedRoute>
            <ProductList />
          </ProtectedRoute>
        ),
      },
      {
        path: "/support-chat",
        element: (
          <ProtectedRoute>
            <SupportChat />
          </ProtectedRoute>
        ),
      },
      {
        path: "/chat/:chatRoomId",
        element: (
          <ProtectedRoute>
            <SupportChat />
          </ProtectedRoute>
        ),
        children: [
          {
            path: ":chatRoomId",
            element: (
              <ProtectedRoute>
                <ChatRoom />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/pushnotification",
        element: (
          <ProtectedRoute>
            <PushNotification />
          </ProtectedRoute>
        ),
      },

      {
        path: "/faq",
        element: (
          <ProtectedRoute>
            <FaqCollapse />
          </ProtectedRoute>
        ),
      },
      {
        path: "/contact",
        element: (
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        ),
      },
      {
        path: "/slider",
        element: (
          <ProtectedRoute>
            <Slider />
          </ProtectedRoute>
        ),
      },
      {
        path: "/coach-slider",
        element: (
          <ProtectedRoute>
            <CoachSlider />
          </ProtectedRoute>
        ),
      },
      {
        path: "/corporate-slider",
        element: (
          <ProtectedRoute>
            <CorporateSlider />
          </ProtectedRoute>
        ),
      },
      {
        path: "/about-us",
        element: (
          <ProtectedRoute>
            <AboutUs />
          </ProtectedRoute>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <ProtectedRoute>
            <PrivacyPolicy />
          </ProtectedRoute>
        ),
      },
      {
        path: "/terms-and-conditions",
        element: (
          <ProtectedRoute>
            <TermsAndCondition />
          </ProtectedRoute>
        ),
      },
      {
        path: "/:serviceType-services", // Dynamic route for services
        element: (
          <ProtectedRoute>
            <SpecificService />
          </ProtectedRoute>
        ), // Services component
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notification",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },

      {
        path: "/admin-list",
        element: (
          <ProtectedRoute>
            <Setting />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
