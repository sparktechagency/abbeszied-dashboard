import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PickDate from "../../../components/common/PickDate";
import { useClientCoachGraphQuery } from "../../../redux/apiSlices/dashboardSlice";

function TraineeAndCoaches() {
  // Track which bar set is active - can be "Customer", "ServiceProvider", or "both"
  const [selectedYear, setSelectedYear] = useState("2025");
  const [activeView, setActiveView] = useState("both");

  const {
    data: clientCoachGraph,
    isLoading,
    error,
  } = useClientCoachGraphQuery({
    year: selectedYear,
  });

  // Transform API data to chart format
  const transformApiDataToChart = (apiData) => {
    if (!apiData?.data) return [];

    const monthNames = [
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

    return apiData.data.map((monthData, index) => {
      const monthKey = Object.keys(monthData)[0]; // e.g., "january"
      const monthInfo = monthData[monthKey];

      return {
        month: monthNames[index],
        Trainee: monthInfo.client_count,
        Players: monthInfo.coach_count,
      };
    });
  };

  // Use API data if available, otherwise use default data
  const chartData = clientCoachGraph
    ? transformApiDataToChart(clientCoachGraph)
    : [
        { month: "Jan", Trainee: 0, Players: 0 },
        { month: "Feb", Trainee: 0, Players: 0 },
        { month: "Mar", Trainee: 0, Players: 0 },
        { month: "Apr", Trainee: 0, Players: 0 },
        { month: "May", Trainee: 0, Players: 0 },
        { month: "Jun", Trainee: 0, Players: 0 },
        { month: "Jul", Trainee: 0, Players: 0 },
        { month: "Aug", Trainee: 0, Players: 0 },
        { month: "Sep", Trainee: 0, Players: 0 },
        { month: "Oct", Trainee: 0, Players: 0 },
        { month: "Nov", Trainee: 0, Players: 0 },
        { month: "Dec", Trainee: 0, Players: 0 },
      ];

  // Handle radio button clicks
  const handleRadioClick = (viewType) => {
    // If clicking the same view that's already active, show both
    if (viewType === activeView) {
      setActiveView("both");
    } else {
      // Otherwise, switch to the clicked view
      setActiveView(viewType);
    }
  };

  // Determine which bars should be visible based on active view
  const showCustomer = activeView === "Customer" || activeView === "both";
  const showServiceProvider =
    activeView === "ServiceProvider" || activeView === "both";

  // Custom radio button legend
  const CustomLegend = () => {
    return (
      <div className="flex items-center justify-center gap-8 absolute top-1 right-[40%]">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id="customerRadio"
            name="legendRadio"
            checked={activeView === "Customer"}
            onChange={() => handleRadioClick("Customer")}
            className="cursor-pointer hidden"
          />
          <label
            htmlFor="customerRadio"
            className="flex items-center cursor-pointer"
            onClick={() => handleRadioClick("Customer")}
          >
            <span className="inline-block w-4 h-4 mr-2 bg-abbes rounded"></span>
            Trainee
          </label>
        </div>
        <div className="flex items-center gap-2 rounded-full">
          <input
            type="radio"
            id="serviceProviderRadio"
            name="legendRadio"
            checked={activeView === "ServiceProvider"}
            onChange={() => handleRadioClick("ServiceProvider")}
            className="cursor-pointer hidden"
          />
          <label
            htmlFor="serviceProviderRadio"
            className="flex items-center cursor-pointer"
            onClick={() => handleRadioClick("ServiceProvider")}
          >
            <span className="inline-block w-4 h-4 mr-2 bg-[#ffd6af] rounded"></span>
            Players
          </label>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center justify-between px-6 mt-5 relative">
        <h1 className="text-2xl text-abbes font-semibold">Trainee & Coaches</h1>
        <CustomLegend />
        <PickDate setSelectedYear={setSelectedYear} />
      </div>

      <div className="w-full h-full py-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-lg text-red-500">Error loading data</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="none"
                strokeWidth={0.2}
                vertical={false}
              />
              <XAxis dataKey="month" style={{ fontSize: "14px" }} />
              <YAxis hide={false} style={{ fontSize: "14px" }} />
              <Tooltip
                content={<CustomTooltip />}
                isAnimationActive={true}
                cursor={false}
              />
              {showCustomer && (
                <Bar dataKey="Trainee" fill="#fd7d00" barSize={35} radius={4} />
              )}
              {showServiceProvider && (
                <Bar dataKey="Players" fill="#ffd6af" barSize={35} radius={4} />
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}

export default TraineeAndCoaches;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative flex items-center ml-4">
        {/* Arrow (pointing left) */}
        <div className="absolute w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-abbes -left-1"></div>

        {/* Tooltip Content */}
        <div className="bg-abbes px-2 py-1 border-none text-sm text-white rounded shadow-md">
          {payload.map((pld, index) => (
            <div
              key={index}
              className={`${
                pld.dataKey === "Trainee"
                  ? "border rounded-md px-1  text-[#fd7d00]"
                  : "border rounded-md px-1  text-[#ffd6af]"
              } text-[14px] bg-white flex flex-col gap-1`}
            >
              {pld.value}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
