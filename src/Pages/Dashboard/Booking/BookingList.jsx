import React from "react";
import SelectDuration from "../../../components/common/SelectDuration";
import { Card } from "../Home/Home";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import BookigListTable from "./BookigListTable";
function BookingList() {
  const stats = [
    {
      label: "Total Bookings",
      value: "3765",
      percent: +2.6,
      color: "#00a76f",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Bookings in Progress",
      value: "3765",
      percent: +2.6,
      color: "#00b8d9",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Completed Bookings",
      value: "3765",
      percent: +2.6,
      color: "#18a0fb",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
    {
      label: "Canceled Bookings",
      value: "3765",
      percent: -2.6,
      color: "#ff5630",
      icon: [<IoTrendingUp size={20} />, <IoTrendingDown size={20} />],
    },
  ];
  return (
    <div>
      <div className="w-full flex justify-end mb-5">
        <SelectDuration />
      </div>
      <div className="flex items-center justify-between flex-wrap lg:flex-nowrap gap-10 w-full">
        {stats.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
      <BookigListTable />
    </div>
  );
}

export default BookingList;
