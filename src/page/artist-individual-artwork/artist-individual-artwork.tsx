import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { ArtworkType } from "../gallery/gallery";

import "./artist-individual-artwork.scss";
import ImagePreviewerAndEdit from "../../image-edit-preview/image-edit-preview";
import InputField from "../../components/input-field/input-field";
import PrimaryButton from "../../components/primary-button/primary-button";

const ArtistIndividualArtwork: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<ArtworkType>({
    name: "",
    collection: "",
    price: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState<{}>({});
  const allArtwork = useSelector(
    (state: { art: { artwork: ArtworkType[] } }) => state.art.artwork
  );

  console.log(form);
  useEffect(() => {
    if (allArtwork.length) {
      const artworkTemp = allArtwork.find((x) => x.id === id);

      setForm({ ...artworkTemp });
    }
  }, [allArtwork, id]);

  const handleInputChange = (name: keyof ArtworkType, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  return (
    <div className="artist-individual-artwork-page">
      <div className="artwork-header">
        <h2>
          <span onClick={() => navigate("/artist/artwork")}>Artworks</span>
          &gt; {form.name} By {form?.artist?.displayName}
        </h2>
        <PrimaryButton
        // disabled={updateUserLoading.loading}
        // loading={updateUserLoading.loading}
        // onClick={handleSubmit}
        >
          Update
        </PrimaryButton>
      </div>
      {Object.keys(form).length ? (
        <div className="art-content-container">
          <ImagePreviewerAndEdit
            cover
            setError={setError}
            setFile={(file) => handleInputChange("image", file)}
            file={form.image || ""}
          />
          <InputField
            label="Name"
            value={form.name}
            onChange={(value) => handleInputChange("name", value)}
          />
          <InputField
            label="Email"
            value={form.collection}
            onChange={(value) => handleInputChange("collection", value)}
          />
          <InputField
            onChange={(value) => handleInputChange("price", value)}
            label="Price"
            value={form.price}
          />
          <InputField
            onChange={(value) => handleInputChange("description", value)}
            label="Description"
            value={form.description}
            multiline
          />
        </div>
      ) : null}
    </div>
  );
};

export default ArtistIndividualArtwork;