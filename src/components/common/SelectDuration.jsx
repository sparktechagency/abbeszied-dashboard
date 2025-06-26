import { Select } from "antd";

function SelectDuration({ onDurationChange, selectedDuration = "today" }) {
  const handleChange = (value) => {
    console.log(`selected ${value}`);
    onDurationChange(value);
  };

  return (
    <div>
      <Select
        value={selectedDuration}
        style={{ width: 120, height: 40 }}
        onChange={handleChange}
        options={[
          { value: "today", label: "Today" },
          { value: "thisWeek", label: "This Week" },
          { value: "thisMonth", label: "This Month" },
          { value: "last30Days", label: "Last 30 Days" },
        ]}
      />
    </div>
  );
}

export default SelectDuration;
