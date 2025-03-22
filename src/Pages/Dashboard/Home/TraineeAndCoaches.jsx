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

function TraineeAndCoaches() {
  // Track which bar set is active - can be "Customer", "ServiceProvider", or "both"
  const [activeView, setActiveView] = useState("both");

  const data = [
    { month: "Jan", Trainee: 4000, Players: 2400 },
    { month: "Feb", Trainee: 3000, Players: 1398 },
    { month: "Mar", Trainee: 2000, Players: 9800 },
    { month: "Apr", Trainee: 2780, Players: 3908 },
    { month: "May", Trainee: 1890, Players: 4800 },
    { month: "Jun", Trainee: 2390, Players: 3800 },
    { month: "Jul", Trainee: 3490, Players: 4300 },
    { month: "Aug", Trainee: 2000, Players: 9800 },
    { month: "Sep", Trainee: 2780, Players: 3908 },
    { month: "Oct", Trainee: 1890, Players: 4800 },
    { month: "Nov", Trainee: 2390, Players: 3800 },
    { month: "Dec", Trainee: 3490, Players: 4300 },
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
        <PickDate />
      </div>

      <div className="w-full h-full py-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              {pld.value}K
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};
