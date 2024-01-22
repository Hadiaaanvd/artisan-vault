import React from "react";
import "./primary-button.scss";
import Loader from "../loader/loader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading: {};
}

const PrimaryButton: React.FC<ButtonProps> = ({
  loading,
  children,
  ...props
}) => {
  return (
    <button className="primary-button-component" {...props}>
      {loading ? <Loader /> : ""}
      {children}
    </button>
  );
};

export default PrimaryButton;
