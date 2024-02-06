import React from "react";
import "./input-field.scss";

interface InputFieldProps {
  placeholder?: string;
  label?: string;
  value: string | "";
  multiline?: boolean;
  disabled?: boolean;
  name?: string;
  type?: string;
  onChange?: (value: string) => void;
}

type ChangeEvent =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  label,
  value,
  onChange,
  disabled,
  multiline,
  type,
}) => {
  const handleInputChange = (event: ChangeEvent) => {
    const newValue = event.target.value;

    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="input-field-component">
      {label && label}
      {multiline ? (
        <textarea
          rows={6}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
        />
      ) : (
        <input
          disabled={disabled}
          type={type || "text"}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default InputField;
