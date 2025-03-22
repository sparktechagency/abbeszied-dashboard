import React from "react";

const ButtonEDU = ({ actionType, onClick, children, className }) => {
  const getButtonStyles = () => {
    switch (actionType) {
      case "add":
        return "bg-abbes text-white w-28 h-10 rounded-md border border-abbes transition-all duration-300 hover:bg-transparent hover:text-abbes";
      case "update":
        return "bg-abbes text-white w-28 h-10 rounded-md border border-abbes transition-all duration-300 hover:bg-transparent hover:text-abbes";
      case "save":
        return `bg-abbes text-white min-w-28 h-10 rounded-md border border-abbes transition-all duration-300 hover:bg-transparent hover:text-abbes ${className}`;
      case "edit":
        return "bg-abbes text-white w-28 h-10 rounded-md border border-abbes transition-all duration-300 hover:bg-transparent hover:text-abbes";
      case "delete":
        return "bg-red-600 text-white w-28 h-10 rounded-md border border-red-600 transition-all duration-300 hover:bg-transparent hover:text-red-600";
      case "cancel":
        return "bg-gray-300 text-black w-28 h-10 rounded-md border border-gray-400 transition-all duration-300 hover:bg-transparent hover:text-gray-600";
      default:
        return "bg-abbes text-white w-28 h-10 rounded-md border border-abbes transition-all duration-300 hover:bg-transparent hover:text-abbes";
    }
  };

  return (
    <button
      className={`${getButtonStyles()} flex items-center justify-center font-semibold`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonEDU;
