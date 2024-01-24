import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FilterType } from "../gallery/gallery";
import { authType } from "../../App";
import { AppDispatch } from "../../redux/store";
import { updateArtworkStatus } from "../../redux/artwork/artwork.action";
import { useNavigate } from "react-router-dom";
import { ArtworkType } from "../artwork/artwork";

import Toggle from "react-toggle";
import "./artist-artwork.scss";
import "react-toggle/style.css";
const ArtistArtwork: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const allArtwork = useSelector(
    (state: { art: { artwork: ArtworkType[] } }) => state.art.artwork
  );
  const [collections, setCollections] = useState<string[]>([]);
  const { currentUser } = useSelector(
    (state: { auth: authType }) => state.auth
  );
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);
  const [filters, setFilters] = useState<{ collection: string }>({
    collection: "All",
  });

  const handleToggle = (
    e: React.ChangeEvent<HTMLInputElement>,
    artwork: ArtworkType
  ) => {
    dispatch(updateArtworkStatus(artwork.id, !artwork.disabled));
  };

  useEffect(() => {
    if (allArtwork.length) {
      const collNames = allArtwork
        .filter((x) => x.artist?.email === currentUser.email)
        .map((artwork) => artwork.collection || "");
      setCollections(["All", ...new Set(collNames)]);
    }
  }, [allArtwork, currentUser]);

  useEffect(() => {
    if (allArtwork.length) {
      let userArt = allArtwork.filter(
        (art) => art.artist?.email === currentUser.email
      );

      if (filters.collection !== "All") {
        userArt = userArt.filter((x) => x.collection === filters.collection);
      }
      setArtworks([...userArt]);
    }
  }, [allArtwork, filters, currentUser]);

  const updateFilters = (filter: FilterType) => {
    setFilters({ ...filters, ...filter });
  };

  const redirectToCreate = () => navigate("/artist/artwork/create");

  return (
    <div className="artist-artwork-page">
      <div className="artist-artwork-header">
        <h2>
          Gallery of Visions: The Curated Art of {currentUser.displayName}
        </h2>
        <button onClick={redirectToCreate}>+ Add Artwork</button>
      </div>
      <div className="collections-filters">
        {artworks.length ? (
          collections.map((coll, index: number) => (
            <div
              className={`collection ${
                coll === filters.collection ? "active" : ""
              }`}
              onClick={() => updateFilters({ collection: coll })}
              key={index}
            >
              {coll}
            </div>
          ))
        ) : (
          <span>
            You haven't any artwork for display. Click&nbsp;
            <u onClick={redirectToCreate}>here</u> to add an artwork.
          </span>
        )}
      </div>
      <div className="artworks-container">
        {artworks.map((art: ArtworkType, index: number) => (
          <div
            className="art-container"
            key={index}
            onClick={() => navigate(`/artist/artwork/${art.id}`)}
          >
            <img src={art.image} alt="" />
            <div className="art-description">
              <div>
                <div className="artist">{art.name}</div>
                <div className="collection">{art.collection}</div>
                <div className="price">{art.price}</div>
              </div>
              <Toggle
                icons={false}
                defaultChecked={!art.disabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleToggle(e, art)
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistArtwork;
