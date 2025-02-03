import React from "react";
import { FaDollarSign, FaRegCalendarAlt, FaUsers } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { GiHomeGarage } from "react-icons/gi";
import { IoIosArrowDown } from "react-icons/io";
import { MdCarRental } from "react-icons/md";
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
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Subscriptions",
      data: [64, 70, 55, 83, 60, 65, 80, 70, 67, 74, 65, 70],
      backgroundColor: "#3FC7EE",
      borderColor: "#A1A1A1",
      borderWidth: 1,
      barThickness: 32,
      maxBarThickness: 32,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
  },
  scales: {
    x: {
      barPercentage: 1.0,
      categoryPercentage: 1.0,
      grid: {
        display: false, //
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
        display: true, // 👈 Y-Axis এর গ্রিড লাইন বন্ধ থাকবে
      },
    },
  },
};

  return (
    <div>
      <div className="flex justify-end">
        <div className="flex items-center justify-center bg-white p-2 mb-6 w-80 gap-4 rounded-md">
          <FaRegCalendarAlt className="" />
          <p className="">01 Feb 2025 - 28 April 2025</p>
          <IoIosArrowDown />
        </div>
      </div>
      {/* card part  */}
      <div className="grid grid-cols-4 gap-6 h-[120px] mb-9">
        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className=" w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center ">
              <GiHomeGarage color="#007BA5" className="" size={24} />
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
              <MdCarRental color="#007BA5" className="" size={24} />
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
              <FaUsers color="#007BA5" className="" size={24} />
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
          <p>Subscription</p>
          <div className="flex items-center ">
            <p>2025</p>
            <select>
              <option value="january">January</option>
              <option value="february">February</option>
              <option value="march">March</option>
              <option value="april">April</option>
              <option value="may">May</option>
              <option value="june">June</option>
              <option value="july">July</option>
              <option value="august">August</option>
              <option value="september">September</option>
              <option value="october">October</option>
              <option value="november">November</option>
              <option value="december">December</option>
            </select>
          </div>
        </div>

       
        {/* Bar Chart Section */}
        <div className="mt-6">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Home;
