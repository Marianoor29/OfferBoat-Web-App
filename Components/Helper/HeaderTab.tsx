import React from "react";

type Tab = {
  name: string;
};

type HeaderTabProps = {
  tabs?: Tab[];
  onPress?: (name: string) => void;
  mainContainer?: string;
  BtnContainer?: string;
  selectedTopTab?: string;
  selectedTabColor?: string;
};

const HeaderTab = ({
  tabs = [],
  onPress,
  mainContainer,
  selectedTopTab,
  BtnContainer,
}: HeaderTabProps) => {
  return (
    <div className={`flex space-x-4 bg-renterBlue50 py-3 px-3 shadow-md ${mainContainer}`}>
      {tabs.map((item, index) => (
        <button
          key={index}
          onClick={() => onPress?.(item.name)}
          className={`w-[50%] py-2 rounded-md text-white font-medium text-lg 
            ${selectedTopTab === item.name ? "bg-renterBlue" : "bg-transparent"} 
            ${BtnContainer} hover:opacity-80`}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
};

export default HeaderTab;
