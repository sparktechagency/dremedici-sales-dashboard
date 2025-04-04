import { useLocation, useParams } from "react-router-dom";
import SalesCardInfo from "../SalesCardInfo";
import DetailsCard from "./DetailsCard";
import RetailerInfo from "./RetailerInfo";

const ViewSalesReps = () => {
  const { id } = useParams(); // Get dynamic ID from URL
  const location = useLocation(); // Get state data
  const salesRep = location.state; // Received sales rep data
  

  return (
    <div className="">
      <div className="flex  justify-between items-center">
        <div>
          {salesRep ? (
            <div className=" px-4  rounded shadow flex gap-10 items-center w-[450px]">
              {/* Image Section */}
              <img
                src={salesRep.image || "https://via.placeholder.com/150"} // Fallback Image
                alt={salesRep.name}
                className="w-28 h-28 rounded-full mb-4 border"
              />

              {/* Details Section */}

              <div className="flex flex-col gap-3">
                <p>
                  <strong>Name:</strong> {salesRep.name}
                </p>
                <p>
                  <strong>Email:</strong> {salesRep.email}
                </p>
                <p>
                  <strong>Tier:</strong> {"Gold"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">No data available</p>
          )}
        </div>
        <div>
          <DetailsCard />
        </div>
      </div>

      <RetailerInfo salesRep={salesRep} />
    </div>
  );
};

export default ViewSalesReps;
