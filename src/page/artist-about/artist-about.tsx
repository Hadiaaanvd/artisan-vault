import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { UserType, authType } from "../../App";
import { AppDispatch } from "../../redux/store";
import { updateArtistInfo } from "../../redux/auth/auth.action";

import InputField from "../../components/input-field/input-field";

import "./artist-about.scss";
import PrimaryButton from "../../components/primary-button/primary-button";
import ImagePreviewerAndEdit from "../../image-edit-preview/image-edit-preview";

const ArtistAbout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState<{}>({});

  const { currentUser, updateUserLoading } = useSelector(
    (state: { auth: authType }) => state.auth
  );

  // Set up local state for editing
  const [editUser, setEditUser] = useState({
    displayName: currentUser.displayName,
    email: currentUser.email,
    about: currentUser.about,
    photoURL: currentUser.photoURL,
  });

  // Handle changes to input fields
  const handleChange = (name: keyof UserType, value: string) => {
    setEditUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle the submission of the form
  const handleSubmit = () => {
    console.log(editUser);
    dispatch(updateArtistInfo(editUser));
  };

  return (
    <div className="artist-about-page">
      <div className="about-form-header">
        <div className="about-headings">
          <h2>Canvas of Creation: Your Artistic Voyage</h2>
          <p>
            Dive into the depths of my artistic realm where every brushstroke
            tells a story, and every color sings a melody. Here's a window into
            my soul, a gallery of my thoughts, and a testament to the dance of
            my imagination with the canvas.
          </p>
        </div>
        <PrimaryButton
          disabled={updateUserLoading.loading}
          loading={updateUserLoading.loading}
          onClick={handleSubmit}
        >
          Update
        </PrimaryButton>
      </div>
      <div className="profile-section">
        <ImagePreviewerAndEdit
          setError={setError}
          setFile={(value) => setEditUser({ ...editUser, photoURL: value })}
          file={editUser.photoURL || ""}
        />
        <div className="profile-fields-container">
          <InputField placeholder="Email" value={editUser.email} disabled />
          <InputField
            placeholder="Name"
            value={editUser.displayName}
            onChange={(value) => handleChange("displayName", value)}
          />
        </div>
      </div>
      <InputField
        multiline
        value={editUser.about}
        placeholder="Tell the world about your artistic journey. Share the inspiration behind your work, the concepts you explore, and what drives your creative process.."
        onChange={(value) => handleChange("about", value)}
      />
    </div>
  );
};

export default ArtistAbout;
