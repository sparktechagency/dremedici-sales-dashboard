import React from "react";
import { FaCalendarDay, FaDollarSign } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2";
import { MdOutlineHome } from "react-icons/md";
import { PiHouseLine } from "react-icons/pi";
import { Bar } from "react-chartjs-2";
import LineChart from "./LineChart"; // Importing LineChart Component
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
      {/* Card Section */}
      <div className="grid grid-cols-4 gap-6 h-[120px] mb-9">
        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <MdOutlineHome color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">100</h3>
              <h2 className="text-center text-2xl text-base">
                Total Wholesalers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <PiHouseLine color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">12k</h3>
              <h2 className="text-center text-2xl text-base">
                Total Retailers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <HiMiniUsers color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">500</h3>
              <h2 className="text-center text-2xl text-base">
                Total Subscribers
              </h2>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg py-0 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#EFEFEF] flex items-center justify-center">
              <FaDollarSign color="#007BA5" size={24} />
            </div>
            <div>
              <h3 className="text-primary text-[32px] font-semibold">$3049</h3>
              <h2 className="text-center text-2xl text-base">Total Revenue</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Line Chart Section */}
      <div className="bg-white p-4 rounded-lg my-6">
        <h2 className="font-semibold mb-4">Wholesalers & Retailers Growth</h2>
        <LineChart />
      </div>

      {/* Subscription Section */}
      <div className="bg-white p-4 rounded-lg">
        <h2 className="font-semibold mb-4">Subscription</h2>

        {/* Bar Chart */}
        <div className="mt-6" style={{ height: "200px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Home;
