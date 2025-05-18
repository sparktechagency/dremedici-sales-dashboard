import React, { useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import SalesCardInfo from "../SalesCardInfo";
import DetailsCard from "./DetailsCard";
import RetailerInfo from "./RetailerInfo";
import { Spin, Alert } from "antd";
import { useGetRetailerByIdQuery } from "../../../redux/apiSlices/myRetailerApi";
import { getImageUrl } from "../../common/imageUrl";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCheckCircle,
  FaUserTag,
} from "react-icons/fa";

const ViewSalesReps = () => {
  const { id } = useParams(); // Get dynamic ID from URL
  const location = useLocation(); // Get state data
  const routeData = location.state; // Received sales rep data from navigation

  // Fetch retailer details using the ID from URL params
  const {
    data: retailerDetails,
    isLoading,
    isError,
    error,
  } = useGetRetailerByIdQuery(id, {
    skip: !id, // Skip query if ID is not available
  });
  console.log(retailerDetails)

  // Use either the data passed through navigation or fetched data
  const salesRep = routeData || retailerDetails?.data;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Loading retailer details..." />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={`Failed to load retailer details: ${
          error?.message || "Unknown error"
        }`}
        type="error"
        showIcon
      />
    );
  }

  if (!salesRep) {
    return (
      <Alert
        message="No Data"
        description="No retailer information available. Please go back and try again."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6 w-full md:w-auto">
          {/* Image Section */}
          <div className="flex justify-center">
            {salesRep?.image ? (
              <img
                src={getImageUrl(salesRep.image)}
                alt={salesRep.name}
                className="w-28 h-28 rounded-full border-2 border-primary object-cover"
              />
            ) : (
              <img
                src="https://i.ibb.co/PGZ7TG64/blue-circle-with-white-user-78370-4707.jpg"
                alt={salesRep.name}
                className="w-28 h-28 rounded-full border-2 border-primary object-cover"
              />
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FaUser className="text-gray-600" />
              <span className="font-semibold text-gray-600">Name:</span>
              <span className="text-lg">{salesRep.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gray-600" />
              <span className="font-semibold text-gray-600">Email:</span>
              <span>{salesRep.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaPhone className="text-gray-600" />
              <span className="font-semibold text-gray-600">Phone:</span>
              <span>{salesRep.phone || "N/A"}</span>
            </div>
          </div>
        </div>

        <div>
          <DetailsCard retailerId={id} />
        </div>
      </div>

      {/* Additional details section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
            <FaMapMarkerAlt /> Address
          </h3>
          <p>{salesRep.address || "No address provided"}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
            <FaCalendarAlt /> Created On
          </h3>
          <p>{new Date(salesRep.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
            <FaCheckCircle /> Verification
          </h3>
          <div className="">
          
            <span
              className={`text-sm px-2 py-1 rounded ${
                salesRep.verifiedByAdmin
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Admin Verification:{" "}
              {salesRep.verifiedByAdmin ? "Verified" : "Not Verified"}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="flex items-center gap-2 text-lg font-semibold mb-2">
            <FaUserTag /> Role
          </h3>
          <p className="uppercase">{salesRep.role}</p>
        </div>
      </div>

      {/* RetailerInfo component with retailer data */}
      <RetailerInfo salesRep={salesRep} />
    </div>
  );
};

export default ViewSalesReps;
