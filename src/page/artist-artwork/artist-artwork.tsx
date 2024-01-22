import React, { useEffect, useState } from "react";
import Toggle from "react-toggle";
import { useSelector } from "react-redux";
import { ArtworkType, FilterType } from "../gallery/gallery";
import { authType } from "../../App";
import "react-toggle/style.css";
import "./artist-artwork.scss";
const ArtistArtwork: React.FC = () => {
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

  useEffect(() => {
    if (allArtwork.length) {
      const collNames = allArtwork
        .filter((x) => x.artist?.email === currentUser.email)
        .map((artwork) => artwork.collection || "");
      const uniqueCollections = ["All", ...new Set(collNames)];
      setCollections(uniqueCollections);
    }
  }, [allArtwork, currentUser]);

  useEffect(() => {
    if (allArtwork.length) {
      const userArt = allArtwork.filter((artwork) => {
        if (
          artwork.artist?.email === currentUser.email &&
          filters.collection === "All"
        )
          return artwork;
        else if (
          artwork.artist?.email === currentUser.email &&
          filters.collection === artwork.collection
        )
          return artwork;
        else return [];
      });
      setArtworks([...userArt]);
    }
  }, [allArtwork, filters, currentUser]);

  const updateFilters = (filter: FilterType) => {
    setFilters({ ...filters, ...filter });
  };
  return (
    <div className="artist-artwork-page">
      <div className="artist-artwork-header">
        <h2>
          Gallery of Visions: The Curated Art of {currentUser.displayName}
        </h2>
        <button>+ Add Artwork</button>
      </div>
      <div className="collections-filters">
        {collections.map((coll, index: number) => (
          <div
            className={`collection ${
              coll === filters.collection ? "active" : ""
            }`}
            onClick={() => updateFilters({ collection: coll })}
            key={index}
          >
            {coll}
          </div>
        ))}
      </div>
      <div className="artworks-container">
        {artworks.map((art: ArtworkType, index: number) => (
          <div className="art-container" key={index}>
            <img src={art.image} alt="" />

            <div className="art-description">
              <div>
                <div className="artist">
                  <b>{art.name}</b>
                </div>
                <div className="collection">{art.collection}</div>
                <div className="price">{art.price}</div>
              </div>
              <Toggle icons={false} defaultChecked={true} onChange={() => {}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistArtwork;
