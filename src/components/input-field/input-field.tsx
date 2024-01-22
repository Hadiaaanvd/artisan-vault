import React, { useState } from "react";
import "./input-field.scss";

interface InputFieldProps {
  placeholder?: string;
  value?: string;
  multiline?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  onChange,
  disabled,
  multiline,
}) => {
  const [inputValue, setInputValue] = useState(value || "");

  const handleInputChange = (event: ChangeEvent) => {
    const newValue = event.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return multiline ? (
    <textarea
      rows={6}
      disabled={disabled}
      className="input-field-component"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
    />
  ) : (
    <input
      disabled={disabled}
      className="input-field-component"
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
    />
  );
};

export default InputField;
