import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home/Home";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy/PrivacyPolicy.jsx";
import ChangePassword from "../Pages/Auth/ChangePassword";
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
import CategoryList from "../Pages/Dashboard/Service/CategoryList/CategoryList.jsx";
import ServiceList from "../Pages/Dashboard/Service/ServiceList/ServiceList.jsx";
import SpecificService from "../Pages/Dashboard/DyanamicPage/SpecificService.jsx";
import SupportChat from "../Pages/Dashboard/SupportChat/SupportChat.jsx";
import ChatRoom from "../Pages/Dashboard/SupportChat/ChatRoom.jsx";
import TraineeList from "../Pages/Dashboard/Trainee/TraineeList.jsx";
import CoachList from "../Pages/Dashboard/Coach/CoachList.jsx";
import CorporateList from "../Pages/Dashboard/CorporateList/CorporateList.jsx";
import CertificateList from "../Pages/Dashboard/CertificateReview/CertificateList.jsx";
import Category from "../Pages/Dashboard/Categoty/Category.jsx";
import Users from "../Pages/Dashboard/User/Users.jsx";

const router = createBrowserRouter([
  {
    path: "/",

    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/coach-list",
        element: <CoachList />,
      },
      {
        path: "/certificate-review",
        element: <CertificateList />,
      },

      {
        path: "/transaction",
        element: <Transaction />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/corporate-list",
        element: <CorporateList />,
      },
      {
        path: "/trainee-list",
        element: <TraineeList />,
      },
      {
        path: "/booking-list",
        element: <BookingList />,
      },
      {
        path: "/support-chat",
        element: <SupportChat />,
      },
      {
        path: "/chat/:chatRoomId", // Change to "/chat/:chatRoomId"
        element: <SupportChat />, // This should be your layout component
        children: [
          {
            path: ":chatRoomId", // Child route for the selected chat user
            element: <ChatRoom />,
          },
        ],
      },
      {
        path: "/pushnotification",
        element: <PushNotification />,
      },

      {
        path: "/faq",
        element: <FaqCollapse />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndCondition />,
      },
      {
        path: "/:serviceType-services", // Dynamic route for services
        element: <SpecificService />, // Services component
      },
      {
        path: "/profile",
        element: <AdminProfile />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },

      {
        path: "/admin-list",
        element: <Setting />,
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
    path: "/user-profile",
    element: <Users />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
