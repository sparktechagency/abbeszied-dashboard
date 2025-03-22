import React, { useState } from "react";
import { DatePicker, ConfigProvider } from "antd";
import { MdOutlineDateRange } from "react-icons/md";

function PickDate() {
  const [isDateSelected, setIsDateSelected] = useState(false);

  const onChange = (date, dateString) => {
    console.log(date, dateString);
    setIsDateSelected(!!dateString);
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
        placeholder="2024"
        picker="year"
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
