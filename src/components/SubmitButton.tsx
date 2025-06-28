import React from "react";

interface SubmitButtonProps {
  children: React.ReactNode;
  onSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ children, onSubmit, disabled = false }) => {
  return (
    <button
      onClick={onSubmit}
      disabled={disabled}
      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg  enabled:hover:from-blue-600 enabled:hover:to-purple-700 outline-none enabled:hover:ring-1  disabled:opacity-50 transition-all transform enabled:hover:scale-105 select-none ">
      {children}
    </button>
  );
};

export default SubmitButton;
