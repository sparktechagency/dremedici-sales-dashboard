import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import Earnings from "../Pages/Dashboard/Earnings";
import Artists from "../Pages/Dashboard/Artists";
import Users from "../Pages/Dashboard/Users";
import Admin from "../Pages/Dashboard/Admin";
import Category from "../Pages/Dashboard/Category";
import Events from "../Pages/Dashboard/Events";
import Banner from "../Pages/Dashboard/Banner";
import AboutUs from "../Pages/Dashboard/AboutUs";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndConditions from "../Pages/Dashboard/TermsAndCondition";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import Subscription from "../Pages/Dashboard/Subscription";
import Profile from "../Pages/Dashboard/Profile";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import SubCategory from "../Pages/Dashboard/SubCategory";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";

const router = createBrowserRouter([
    {
        path: "/",
        // element: <ProtectedRoute><Main /></ProtectedRoute> , 
        element: <Main />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/earnings",
                element: <Earnings />
            },
            {
                path: "/artists",
                element: <Artists />
            },
            {
                path: "/users",
                element: <Users />
            },
            {
                path: "/subscription",
                element: <Subscription />
            },
            {
                path: "/admin",
                element: <Admin />
            },
            {
                path: "/category",
                element: <Category />
            },
            {
                path: "/events",
                element: <Events />
            },
            {
                path: "/banner",
                element: <Banner />
            },
            {
                path: "/about-us",
                element: <AboutUs />
            },
            {
                path: "/privacy-policy",
                element: <PrivacyPolicy />
            },
            {
                path: "/terms-and-conditions",
                element: <TermsAndConditions />
            },
            {
                path: "/change-password",
                element: <ChangePassword />
            },
            {
                path: "/sub-category",
                element: <SubCategory />
            },
            {
                path: "/profile",
                element: <AdminProfile />
            }
            ,
            {
                path: "/notification",
                element: <Notifications/> 
            }
               
        ]
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
            }
        ]
    },
    {
        path: "*",
        element: <NotFound />,
    }
]);

export default router;
