import { useState } from "react";
import SelectDuration from "../../../components/common/SelectDuration";
import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";
import BookigListTable from "./BookigListTable";
import { useGetBookingAnalysisQuery } from "../../../redux/apiSlices/bookingSlice";
import TinyChart from "../../Dashboard/Home/TinyChart";

function BookingList() {
  const [duration, setDuration] = useState("today");

  const { data: bookingAnalysis, isLoading } = useGetBookingAnalysisQuery({
    dateFilter: duration,
  });

  console.log("bookingAnalysis", bookingAnalysis?.data);

  // Create a mapping for easy lookup
  const bookingData =
    bookingAnalysis?.data?.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {}) || {};

  const stats = [
    {
      _id: "pending",
      label: "Pending Bookings",
      value: bookingData.pending?.totalBookings || 0,
      percent: +2.6,
      color: "#00a76f",
    },
    {
      _id: "confirmed",
      label: "Bookings in Progress",
      value: bookingData.confirmed?.totalBookings || 0,
      percent: +2.6,
      color: "#00b8d9",
    },
    {
      _id: "completed",
      label: "Completed Bookings",
      value: bookingData.completed?.totalBookings || 0,
      percent: +2.6,
      color: "#18a0fb",
    },
    {
      _id: "cancelled",
      label: "Canceled Bookings",
      value: bookingData.cancelled?.totalBookings || 0,
      percent: -2.6,
      color: "#ff5630",
    },
  ];

  const handleDurationChange = (newDuration) => {
    setDuration(newDuration);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <div className="mb-6 w-full flex justify-end">
        <SelectDuration
          onDurationChange={handleDurationChange}
          selectedDuration={duration}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((item, index) => (
          <Card key={item._id} item={item} />
        ))}
      </div>
      <div className="bg-white rounded-xl max-h-[60vh] shadow-sm border border-gray-100 ">
        <BookigListTable />
      </div>
    </div>
  );
}

export default BookingList;

const Card = ({ item }) => {
  return (
    <div className="flex w-full items-center justify-between h-36 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col items-start justify-between h-full py-1">
        <p className="text-gray-500 text-sm font-medium">{item.label}</p>
        <p className="text-[32px] font-bold text-gray-800">{item.value}</p>
        <div className="flex items-center gap-1">
          {item.percent >= 0 ? (
            <span className="text-green-500 flex items-center gap-1 text-sm">
              <IoTrendingUp size={16} />
              {Math.abs(item.percent)}% last 7 days
            </span>
          ) : (
            <span className="text-red-500 flex items-center gap-1 text-sm">
              <IoTrendingDown size={16} />
              {Math.abs(item.percent)}% last 7 days
            </span>
          )}
        </div>
      </div>
      <div className="h-16 w-20 flex items-center justify-end">
        <TinyChart color={item.color} />
      </div>
    </div>
  );
};
