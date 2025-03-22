import React, { useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

function AppDownloadStat() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");

  const fullData = [
    { name: "iOS", value: 4000 },
    { name: "Android", value: 6000 },
  ];

  const COLORS = ["#ff562f", "#fd7d00"]; // iOS and Android colors

  // Filtered data based on selection
  const data =
    selectedPlatform === "all"
      ? fullData
      : fullData.filter((item) => item.name === selectedPlatform);

  const totalDownloads = data.reduce((acc, item) => acc + item.value, 0);

  const handleLegendClick = (platform) => {
    if (selectedPlatform === platform) {
      // If the selected platform is clicked again, reset to show both
      setSelectedPlatform("all");
    } else {
      // Otherwise, show the selected platform
      setSelectedPlatform(platform);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 h-full w-[30%]">
      <h2 className="text-lg font-semibold text-gray-700">
        App Download Stats
      </h2>
      <p className="text-sm text-gray-500 -mt-1">
        Downloaded by operating system
      </p>

      <div className="relative flex justify-center items-center mt-1">
        <ResponsiveContainer width={180} height={180}>
          <PieChart>
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    selectedPlatform === "all"
                      ? COLORS[index]
                      : data[0].name === "Android"
                      ? COLORS[1]
                      : COLORS[0]
                  }
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Centered Total Downloads Text */}
        <div className="absolute text-center">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-800">
            {totalDownloads.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Legend Section */}
      <div className="flex justify-center gap-6 ">
        {fullData.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-2 cursor-pointer transition-all ${
              selectedPlatform === item.name
                ? "opacity-100 font-bold"
                : "opacity-70"
            }`}
            onClick={() => handleLegendClick(item.name)}
          >
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            ></span>
            <p className="text-sm text-gray-600">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AppDownloadStat;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="relative flex items-center ml-4 ">
        {/* Arrow (pointing left) */}
        <div className="absolute w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-red-500 -left-1"></div>

        {/* Tooltip Content */}
        <div className="bg-abbes px-2 py-.5  text-black text-[14px] rounded-xl shadow-md z-50">
          {payload.map((pld, index) => (
            <div key={index}>{pld.value}K</div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};
