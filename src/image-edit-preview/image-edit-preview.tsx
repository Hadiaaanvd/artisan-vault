import React, { useRef, useState, ChangeEvent } from "react";
import ImagePreviewIcon from "../assets/upload.svg";
import { ReactComponent as EditIcon } from "../assets/edit.svg";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";

import "./image-edit-preview.scss";

interface ImagePreviewerAndEditProps {
  setError: (error: string | boolean) => void;
  file: string;
  cover?: boolean;
  setFile: (file: string) => void;
  edit?: boolean;
}

const ImagePreviewerAndEdit: React.FC<ImagePreviewerAndEditProps> = ({
  setError,
  cover,
  file,
  setFile,
}) => {
  const [largeFile, setLargeFile] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const size = Math.round(file.size / 1024) / 1024;
      if (!file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif)$/)) {
        setError("Please select a valid image format");
        removeImage();
        return false;
      } else if (size > 1) {
        setLargeFile(true);
        setError("You can only upload files less than 1MB");
        removeImage();
        return false;
      } else if (size < 1) {
        setLargeFile(false);
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setError(false);
        setFile(reader.result as string);
      };
    } else removeImage();
  };

  const removeImage = (e?: React.MouseEvent<SVGElement>) => {
    if (e) e.stopPropagation();
    setFile("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleEdit = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`image-preview-edit-component ${file ? "image-exists" : ""} ${
        cover ? "cover-image" : ""
      }`}
      onClick={handleEdit}
    >
      <img src={file || ImagePreviewIcon} alt="preview" />

      <span className="icon-button-container">
        <EditIcon className="edit-icon" />
        {file && <DeleteIcon onClick={removeImage} className="remove-icon" />}
      </span>

      {largeFile ? "way too large" : ""}
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        id="myFile"
        style={{ display: "none" }}
      />
    </div>
  );
};

export default ImagePreviewerAndEdit;
