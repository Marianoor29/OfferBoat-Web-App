import { useState } from "react";

interface CurrencyInputProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CurrencyInput = ({ 
  value, 
  onValueChange, 
}: CurrencyInputProps) => {
    
  const formatCurrency = (input: string): string => {
    if (!input) return "$0.00";
    const numericValue = input.replace(/[^0-9]/g, "");
    const formattedValue = (Number(numericValue) / 100).toFixed(2);
    return `$${formattedValue}`;
  };

  const [internalValue, setInternalValue] = useState(formatCurrency(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    const formattedText = formatCurrency(text);
    setInternalValue(formattedText);
    onValueChange(formattedText);
  };

  return (
    <input
      type="text"
      value={internalValue}
      onChange={handleChange}
      className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
    />
  );
};

export default CurrencyInput;
