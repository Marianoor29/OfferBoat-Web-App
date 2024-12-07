import { useState } from "react";

type HourSelectorProps = {
  hours: string[]; 
  onSelect: (selectedHour: string) => void; 
  selectedHours?: string; 
};

const HourSelector = ({ hours, onSelect, selectedHours }: HourSelectorProps) => {
  const [selectedHour, setSelectedHour] = useState<string | null>(
    selectedHours || null
  );

  const handlePress = (hour: string) => {
    setSelectedHour(hour); 
    onSelect(hour);
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {hours.map((hour) => (
        <button
          key={hour}
          onClick={() => handlePress(hour)}
          className={`px-4 py-2 text-sm font-medium rounded-lg border transition 
          ${
            selectedHour === hour
              ? "bg-renterBlue50 text-gray-700 border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
          }`}
        >
          {hour} Hours
        </button>
      ))}
    </div>
  );
};

export default HourSelector;
