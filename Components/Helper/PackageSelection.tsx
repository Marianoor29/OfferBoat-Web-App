import { useState } from "react";
import HourSelector from "./HourSelector";
import CurrencyInput from "./CurrencyInput";

type Package = {
  id: number;
  price: string;
  hours: string;
};

type PackageSelectionProps = {
  packages: Package[];
  setPackages: (packages: Package[]) => void;
  onPriceChange: (id: number, price: string) => void;
  onHoursChange: (id: number, hours: string) => void;
  hoursOptions: string[];
};

const PackageSelection = ({
  packages,
  setPackages,
  onPriceChange,
  onHoursChange,
  hoursOptions,
}: PackageSelectionProps) => {
  const handleAddPackage = () => {
    if (packages.length < 5) {
      const newId = packages.length > 0 ? packages[packages.length - 1].id + 1 : 1;
      setPackages([...packages, { id: newId, price: "$0.00", hours: "" }]);
    }
  };

  const handleRemovePackage = (id: number) => {
    setPackages(packages.filter((pkg) => pkg.id !== id));
  };

  return (
    <div className="space-y-6">
      {packages.map((pkg) => (
        <div key={pkg.id} className="p-4 bg-gray-50 rounded-lg shadow-md space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Price</label>
            <CurrencyInput
              value={pkg.price}
              onValueChange={(value) => onPriceChange(pkg.id, value)}
            //   placeholder="Enter price"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-700 font-medium">Hours</label>
            <HourSelector
              hours={hoursOptions}
              onSelect={(hours) => onHoursChange(pkg.id, hours)}
              selectedHours={pkg.hours}
            />
          </div>

          <button
            onClick={() => handleRemovePackage(pkg.id)}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
              packages.length === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={packages.length === 1}
          >
            Remove Package
          </button>
        </div>
      ))}

      <button
        onClick={handleAddPackage}
        className={`w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
          packages.length >= 5
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-ownerGreen hover:bg-emerald-500"
        }`}
        disabled={packages.length >= 5}
      >
        Add Package
      </button>
    </div>
  );
};

export default PackageSelection;
