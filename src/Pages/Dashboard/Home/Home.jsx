import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import CustomerServiceChart from "./TraineeAndCoaches";
import AppDownloadStat from "./AppDownloadStat";
import RevenueAnalysis from "./RevenueAnalysis";
import TinyChart from "./TinyChart";
import TraineeAndCoaches from "./TraineeAndCoaches";
import { useDashboardAnalysisQuery } from "../../../redux/apiSlices/dashboardSlice";
dayjs.extend(customParseFormat);

export const Card = ({ item }) => {
  return (
    <div
      className={`flex w-full items-center justify-evenly h-32 rounded-xl bg-white gap-10 ${item.bg}`}
    >
      <div className="h-[80%] py-1.5 flex flex-col items-start justify-between">
        <p>{item.label}</p>
        <p className="text-[24px] font-bold">{item.value}</p>
        {item.percent > 0 ? (
          <p>
            <span className="text-green-400 flex gap-2 items-center">
              {item.icon[0]}
              <span>{Math.abs(item.percent)}% last 7 days</span>
            </span>
          </p>
        ) : (
          <p>
            <span className="text-red-400 flex gap-2 items-center">
              {item.icon[1]}
              <span>{Math.abs(item.percent)}% last 7 days</span>
            </span>
          </p>
        )}
      </div>
      <div className="h-[60%] flex items-center justify-end w-20">
        <TinyChart color={item.color} />
      </div>
    </div>
  );
};

const Home = () => {
  const { data: getAnalysis, isLoading, error } = useDashboardAnalysisQuery();
  console.log("analysis", getAnalysis?.data);

  // Create stats array with dynamic data
  const getStatsData = () => {
    const defaultStats = [
      {
        label: "Total Client",
        value: "0",
        percent: +2.6,
        color: "#00a76f",
        icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
      },
      {
        label: "Total Coaches",
        value: "0",
        percent: +2.6,
        color: "#00b8d9",
        icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
      },
      {
        label: "Total Corporate",
        value: "0",
        percent: +2.6,
        color: "#18a0fb",
        icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
      },
      {
        label: "Total Revenue",
        value: "$0",
        percent: -2.6,
        color: "#ff5630",
        icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
      },
    ];

    // If we have API data, update the values
    if (getAnalysis?.data) {
      const apiData = getAnalysis.data;
      return [
        {
          ...defaultStats[0],
          value: apiData.totalTrainee?.toString() || "0",
        },
        {
          ...defaultStats[1],
          value: apiData.totalCoaches?.toString() || "0",
        },
        {
          ...defaultStats[2],
          value: apiData.totalCorporate?.toString() || "0",
        },
        {
          ...defaultStats[3],
          value: `$${apiData.totalRevenue?.toLocaleString() || "0"}`,
        },
      ];
    }

    return defaultStats;
  };

  const stats = getStatsData();

  return (
    <div className="">
      <div className="flex flex-col flex-wrap items-end gap-5 justify-between w-full bg-transparent rounded-md">
        <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-10 w-full">
          {isLoading ? (
            // Loading state
            <div className="flex items-center justify-center w-full h-32">
              <div className="text-lg">Loading dashboard data...</div>
            </div>
          ) : error ? (
            // Error state
            <div className="flex items-center justify-center w-full h-32">
              <div className="text-lg text-red-500">
                Error loading dashboard data
              </div>
            </div>
          ) : (
            // Normal state with data
            stats.map((item, index) => <Card key={index} item={item} />)
          )}
        </div>
      </div>

      <div className="w-full h-[330px] bg-white rounded-lg mt-4 relative flex flex-col justify-evenly">
        <TraineeAndCoaches />
      </div>
      <div className="w-full h-[300px] mt-4 flex items-center justify-between bg-transparent rounded-lg">
        <AppDownloadStat />
        <RevenueAnalysis />
      </div>
    </div>
  );
};

export default Home;
