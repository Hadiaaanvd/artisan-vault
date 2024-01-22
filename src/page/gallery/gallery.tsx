import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Filter } from "../../assets/filter.svg";

import "./gallery.scss";

export type ArtworkType = {
  id?: string;
  name?: string | undefined;
  artist?:
    | {
        name: string;
        email: string;
        image: string;
        about?: string | undefined;
      }
    | undefined;
  collection?: string;
  price?: string | undefined;
  description?: string | undefined;
  image?: any;
};

export type FilterType = {
  artist?: string;
  collection?: string;
};

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const allArtwork = useSelector(
    (state: { art: { artwork: ArtworkType[] } }) => state.art.artwork
  );
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);
  const [collections, setCollections] = useState<string[]>([]);

  const [filters, setFilters] = useState<{ collection: string }>({
    collection: "All",
  });

  useEffect(() => {
    if (allArtwork.length) {
      const collNames = allArtwork.map((artwork) => artwork.collection || "");
      const uniqueCollections = ["All", ...new Set(collNames)];
      setArtworks([...allArtwork]);
      setCollections(uniqueCollections);
    }
  }, [allArtwork]);

  useEffect(() => {
    if (allArtwork.length) {
      const filterByCollection = allArtwork.filter(
        (x) => x.collection === filters.collection
      );
      setArtworks(
        filters.collection === "All" ? allArtwork : [...filterByCollection]
      );
    }
  }, [allArtwork, filters]);

  const updateFilters = (filter: FilterType) => {
    setFilters({ ...filters, ...filter });
  };

  const redirect = (id: string) => {
    if (id) navigate(`/artwork/${id}`);
  };

  return (
    <div className="gallery-page">
      <div className="filter-containers">
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
        <div className="other-filters">
          <div className="filter" onClick={() => updateFilters({ artist: "" })}>
            Artist
          </div>
          <div className="filter">Filter</div>
          <Filter />
        </div>
      </div>

      <div className="artworks-container">
        {artworks.map((art: ArtworkType, index: number) => (
          <div
            className="art-container"
            key={index}
            onClick={() => redirect(art.id || "")}
          >
            <img src={art.image} alt="" />
            <div className="art-description">
              <div className="artist">
                <b>{art.name}</b> By {art.artist?.name}
              </div>
              <div className="collection">{art.collection}</div>
              <div className="price">{art.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
