import React, { useState, useEffect } from "react";
import { DatePicker, ConfigProvider } from "antd";
import { MdOutlineDateRange } from "react-icons/md";
import dayjs from "dayjs";

function PickDate({ setSelectedYear = () => {} }) {
  // Default function to prevent error
  const [isDateSelected, setIsDateSelected] = useState(true);

  // Set default year on component mount
  useEffect(() => {
    if (typeof setSelectedYear === "function") {
      setSelectedYear("2025");
    }
  }, [setSelectedYear]);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setIsDateSelected(!!dateString);

    // Pass the selected year to parent component
    if (typeof setSelectedYear === "function") {
      if (dateString) {
        setSelectedYear(dateString); // This will be the year as string (e.g., "2024")
      } else {
        setSelectedYear("2025"); // Reset to default if cleared
      }
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            hoverBorderColor: "#fd7d00",
            activeBorderColor: "#fd7d00",
            activeShadow: "none",
          },
        },
      }}
    >
      <DatePicker
        onChange={onChange}
        placeholder="2025"
        picker="year"
        defaultValue={dayjs("2025")} // Set default value to 2025
        className="border-1 h-8 w-24 py-2 rounded-lg"
        suffixIcon={
          <div
            className="rounded-full w-6 h-6 p-1 flex items-center justify-center"
            style={{
              backgroundColor: isDateSelected ? "#fd7d00" : "#fbede0",
            }}
          >
            <MdOutlineDateRange color={isDateSelected ? "white" : "#fd7d00"} />
          </div>
        }
      />
    </ConfigProvider>
  );
}

export default PickDate;
