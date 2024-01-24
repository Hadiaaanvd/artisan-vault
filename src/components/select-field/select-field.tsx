import React, { useState } from "react";
import "./select-field.scss";

type SelectFieldType = {
  options?: string[];
  handleChange: (value: string) => void;
  value: string;
  className?: string;
};

const SelectField: React.FC<SelectFieldType> = ({
  options = [],
  handleChange,
  value,
  className,
}) => {
  const [show, setShow] = useState<boolean>(false);

  const toggleDropdown = () => setShow(!show);

  const handleOptionClick = (value: string) => {
    handleChange(value);
    setShow(false);
  };

  return (
    <div className={`select-field-component ${className || ""}`}>
      <div className="dropdown-field" onClick={toggleDropdown}>
        <div>
          Artist <span className="value-container">({value})</span>
        </div>
        <span>╲╱</span>
      </div>
      {show && (
        <div className="options-container">
          {options.map((option, index) => (
            <div
              key={index}
              className={`option-item ${option === value ? "selected" : ""}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectField;
