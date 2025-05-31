import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, Select, Spin } from "antd";
import { useMySellsCompireQuery } from "../../redux/apiSlices/mySellsCompireApi";

const { Option } = Select;

const MySales = () => {
  // Get current year
  const currentYear = new Date().getFullYear();

  // Default to current year and previous year
  const [yearComparison, setYearComparison] = useState([
    currentYear.toString(),
    (currentYear - 1).toString(),
  ]);

  // Available years for selection (current year, previous 3 years, and next year)
  const availableYears = [
    (currentYear - 3).toString(),
    (currentYear - 2).toString(),
    (currentYear - 1).toString(),
    currentYear.toString(),
    (currentYear + 1).toString(),
  ];

  // Prepare the arguments for the API query - as a single comma-separated string
  const queryArgs = [
    {
      name: "years",
      value: yearComparison.join(","),
    },
  ];

  // Call the API with the selected years
  const {
    data: apiResponse,
    isLoading,
    isError,
  } = useMySellsCompireQuery(queryArgs);

  // Transform API data to chart format
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (apiResponse?.success && apiResponse?.data) {
      // Create month-by-month data from the API response
      const months = [
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
      ];
      const transformedData = months.map((month, index) => {
        const monthData = { month };

        // Add data for each selected year
        yearComparison.forEach((year) => {
          if (apiResponse.data[year]) {
            const monthEntry = apiResponse.data[year].find(
              (item) => item.month === month
            );
            monthData[year] = monthEntry ? monthEntry.sales : 0;
          } else {
            monthData[year] = 0;
          }
        });

        return monthData;
      });

      setSalesData(transformedData);
    }
  }, [apiResponse, yearComparison]);

  // Handle year selection change
  const handleYearChange = (value) => {
    setYearComparison(value);
  };

  // Calculate total sales for selected years
  const calculateTotals = () => {
    const totals = {};

    yearComparison.forEach((year) => {
      if (apiResponse?.data?.[year]) {
        totals[year] = apiResponse.data[year].reduce(
          (sum, item) => sum + (item.sales || 0),
          0
        );
      } else {
        totals[year] = 0;
      }
    });

    return totals;
  };

  const salesTotals = calculateTotals();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">My Sales</h2>

      <div className="mb-6 bg-gradient-to-r from-primary to-secondary p-6">
        <Card title="Year-over-Year Comparison" className="w-full shadow">
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Select Years to Compare:
            </label>
            <Select
              mode="multiple"
              placeholder="Select years"
              value={yearComparison}
              onChange={handleYearChange}
              style={{ width: "100%", height: 40 }}
              maxTagCount={4}
            >
              {availableYears.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          
          ) : (
            <>
              {/* Total Sales Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
                {yearComparison.map((year) => (
                  <div
                    key={year}
                    className="bg-gradient-to-r from-primary to-secondary text-white p-4 rounded"
                  >
                    <h3 className="text-lg font-medium">{year} Total</h3>
                    <p className="text-2xl font-bold">
                      ${salesTotals[year]?.toLocaleString() || "0"}
                    </p>
                  </div>
                ))}
              </div>

              {/* Sales Chart */}
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `$${value.toLocaleString()}`}
                    />
                    <Legend />
                    {yearComparison.map((year, index) => (
                      <Line
                        key={year}
                        type="monotone"
                        dataKey={year}
                        stroke={
                          index === 0
                            ? "#8884d8"
                            : index === 1
                            ? "#82ca9d"
                            : index === 2
                            ? "#ffc658"
                            : "#ff7300"
                        }
                        activeDot={{ r: 8 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MySales;
