import React from "react";
import "./primary-button.scss";
import Loader from "../loader/loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: {};
  inActive?: boolean;
}

const PrimaryButton: React.FC<ButtonProps> = ({
  loading,
  children,
  inActive,
  ...props
}) => {
  return (
    <button
      className={`primary-button-component ${inActive ? "no-background" : ""}`}
      {...props}
    >
      {loading ? <Loader /> : ""}
      {children}
    </button>
  );
};

export default PrimaryButton;
