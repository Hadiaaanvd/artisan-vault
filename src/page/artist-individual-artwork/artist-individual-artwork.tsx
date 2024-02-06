import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { authType } from "../../App";
import { ArtworkType } from "../artwork/artwork";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  resetArtworkLoading,
  updateArtworkDetails,
} from "../../redux/artwork/artwork.action";

import ImagePreviewerAndEdit from "../../image-edit-preview/image-edit-preview";
import InputField from "../../components/input-field/input-field";
import PrimaryButton from "../../components/primary-button/primary-button";

import "./artist-individual-artwork.scss";
import { AppDispatch } from "../../redux/store";
type loading = { loading: boolean; success: boolean; error: any };
const defaultForm = {
  name: "",
  collection: "",
  price: "",
  description: "",
  image: "",
};
const ArtistIndividualArtwork: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ArtworkType>(defaultForm);
  const [formErrors, setFromErrors] = useState<ArtworkType>({
    ...defaultForm,
    image: true,
  });

  const { artwork, updateArtworkLoading } = useSelector(
    (state: {
      art: { artwork: ArtworkType[]; updateArtworkLoading: loading };
    }) => state.art
  );

  const { currentUser } = useSelector(
    (state: { auth: authType }) => state.auth
  );

  useEffect(() => {
    if (currentUser) {
      if (artwork.length && currentUser) {
        const artworkTemp = artwork.find((x) => x.id === id);
        if (artworkTemp) setForm({ ...artworkTemp });
        else {
          setForm({
            ...defaultForm,
            artist: {
              displayName: currentUser.displayName,
              email: currentUser.email || "",
              photoURL: currentUser.photoURL,
              about: currentUser.about,
            },
          });
        }
      }
    }
  }, [artwork, id, currentUser]);

  console.log(form);

  useEffect(() => {
    if (updateArtworkLoading.success) {
      dispatch(resetArtworkLoading());
      navigate("/artist/artwork");
    } else if (updateArtworkLoading.error) alert(updateArtworkLoading.error);
  }, [updateArtworkLoading]);

  const handleInputChange = (name: keyof ArtworkType, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
    setFromErrors((prevErr) => ({ ...prevErr, [name]: !value }));
  };

  const handleSubmit = () => {
    console.log(form);
    dispatch(updateArtworkDetails(form));
  };

  const isSubmitDisabled = Object.values(formErrors).some((error) => error);

  return (
    <div className="artist-individual-artwork-page">
      <div className="artwork-header">
        <h2>
          <span onClick={() => navigate("/artist/artwork")}>Artworks</span>
          &gt; {form.name} By {currentUser.displayName}
        </h2>
        <PrimaryButton
          disabled={isSubmitDisabled || updateArtworkLoading.loading}
          loading={updateArtworkLoading.loading}
          onClick={handleSubmit}
        >
          Update
        </PrimaryButton>
      </div>

      <div className="art-content-container">
        <ImagePreviewerAndEdit
          cover
          setError={(err) => setFromErrors({ ...formErrors, image: err })}
          setFile={(file) => handleInputChange("image", file)}
          file={form.image || ""}
        />
        <span className="error">{formErrors.image}</span>
        <InputField
          label="Name *"
          value={form.name || ""}
          onChange={(value) => handleInputChange("name", value)}
        />
        <InputField
          type="number"
          onChange={(value) => handleInputChange("price", value)}
          label="Price *"
          value={form.price || ""}
        />
        <InputField
          onChange={(value) => handleInputChange("collection", value)}
          label="Collection *"
          value={form.collection || ""}
        />
        <InputField
          onChange={(value) => handleInputChange("description", value)}
          label="Description *"
          value={form.description || ""}
          multiline
        />
        Please fill in all the required fields before updating
      </div>
    </div>
  );
};

export default ArtistIndividualArtwork;
