import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { message } from "antd"; // Import Ant Design's message component

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(token);

    const currentTime = Date.now() / 1000; // seconds
    if (decoded.exp < currentTime) {
      // token expired
      localStorage.removeItem("accessToken"); // expired token remove
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    if (decoded.role === "SALES") {
      return children; // If role is SALES, allow access
    } else {
      message.error(
        "You do not have the required permissions to access this page. Sales role required."
      ); // Show error if role is not SALES
      return <Navigate to="/auth/login" state={{ from: location }} replace />; // Redirect to login after showing error
    }
  } catch (error) {
    message.error("Invalid token. Please log in again."); // Show error if token is invalid
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }
};

export default PrivateRoute;
