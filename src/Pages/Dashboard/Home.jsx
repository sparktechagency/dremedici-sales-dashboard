import React from "react";
import { FaCalendarDay, FaDollarSign, FaRegCalendarAlt, } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { MdOutlineHome, MdOutlineWarehouse } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { PiHouseLine } from "react-icons/pi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Home = () => {
const data = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Subscriptions",
      data: [64, 27, 83, 90, 87, 85, 70, 40, 32, 74, 65, 70],
      backgroundColor: "#3FC7EE",
      borderColor: "#A1A1A1",
      borderWidth: 1,
      barThickness: 24,
      maxBarThickness: 24,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      barPercentage: 1.0,
      categoryPercentage: 1.0,
      grid: {
        display: false,
        color: "#A1A1A1",
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 20,
        suggestedMin: 0,
        suggestedMax: 100,
      },
      grid: {
        display: true,
        lineWidth: 2,
      },
    },
  },
};


  return (
    <div>
      <div className="flex justify-end">
        <div className="flex items-center justify-center bg-white p-2 mb-6 w-80 gap-4 rounded-md">
          <FaRegCalendarAlt className="" />
          <p className="">01 Feb 2025 - 28 Apr 2025</p>
          <IoIosArrowDown />
        </div>
      </div>
      {/* card part  */}
      <div className="grid grid-cols-4 gap-6 h-[120px] mb-9">
        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className=" w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center ">
              <MdOutlineHome color="#007BA5" className="" size={24} />
            </div>
            <div>
              <h3 className=" text-primary text-[32px] font-semibold">100</h3>
              <h2 className="text-center text-2xl text-base ">
                Total Wholesalers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className=" w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center ">
              <PiHouseLine color="#007BA5" className="" size={24} />
            </div>
            <div>
              <h3 className=" text-primary text-[32px] font-semibold">12k</h3>
              <h2 className="text-center text-2xl text-base ">
                Total Rentailers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className=" w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center ">
              <HiMiniUsers color="#007BA5" className="" size={24} />
            </div>
            <div>
              <h3 className=" text-primary text-[32px] font-semibold">500</h3>
              <h2 className="text-center text-2xl text-base ">
                Total Subscribers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className=" w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center ">
              <FaDollarSign color="#007BA5" className="" size={24} />
            </div>
            <div>
              <h3 className=" text-primary text-[32px] font-semibold">$3049</h3>
              <h2 className="text-center text-2xl text-base ">
                Total Wholesalers
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* subcription part  */}
      <div className="bg-white p-4 rounded-lg">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-semibold">Subscription</h2>
          <div className="flex items-center py-2 px-3 gap-2 border-2 bg-[#FFFFFF] rounded-lg">
            <FaCalendarDay />
            <p>2025</p>
            <select>
              <option value="january">Jan</option>
              <option value="february">Feb</option>
              <option value="march">Mar</option>
              <option value="april">Apr</option>
              <option value="may">May</option>
              <option value="june">Jun</option>
              <option value="july">Jul</option>
              <option value="august">Aug</option>
              <option value="september">Sep</option>
              <option value="october">Oct</option>
              <option value="november">Nov</option>
              <option value="december">Dec</option>
            </select>
          </div>
        </div>

        {/* Bar Chart Section */}
        <div className="mt-6" style={{ height: "200px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Home;
