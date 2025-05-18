import React from "react";
import { LuBadgeDollarSign } from "react-icons/lu";
import { FaUsers } from "react-icons/fa6";
import { useRetailerDetailsAnalysisQuery } from "../../../redux/apiSlices/myRetailerApi";
import { useParams } from "react-router-dom";

const DetailsCard = () => {
  const { id } = useParams();
  const { data: response } = useRetailerDetailsAnalysisQuery(id);

  // Your actual data is inside response.data
  const analysisData = response?.data;

  return (
    <div className="grid grid-cols-3 gap-6 h-[120px] mb-9">
      <SalesRepsCard
        icon={LuBadgeDollarSign}
        value={
          analysisData?.totalRevenue !== undefined
            ? `$${analysisData.totalRevenue.toFixed(2)}`
            : "N/A"
        }
        label="Total Purchased"
      />
      <SalesRepsCard
        icon={FaUsers}
        value={
          analysisData?.totalOrders !== undefined
            ? analysisData.totalOrders
            : "N/A"
        }
        label="Total Orders"
      />
      {/* Add more cards here if needed */}
    </div>
  );
};

// SalesRepsCard Component
const SalesRepsCard = ({ icon: Icon, value, label }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg p-6 flex items-center justify-between gap-4 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#EFEFEF] flex items-center justify-center">
          <Icon color="#007BA5" size={40} />
        </div>
        <div>
          <h3 className="text-white text-[32px] font-semibold">{value}</h3>
          <h2 className="text-white text-center text-xl">{label}</h2>
        </div>
      </div>
    </div>
  );
};

export default DetailsCard;
