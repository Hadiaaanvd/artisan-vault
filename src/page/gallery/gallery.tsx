import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Filter } from "../../assets/filter.svg";
import { ArtworkType } from "../artwork/artwork";

import Fuse from "fuse.js";
import Navbar from "../../components/navbar/navbar";

import "./gallery.scss";
import PrimaryButton from "../../components/primary-button/primary-button";

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
  const [filters, setFilters] = useState<FilterType>({
    collection: "All",
    artist: "All",
  });

  const fuse = new Fuse(allArtwork, {
    keys: ["name", "collection", "price", "artist.name"],
  });

  useEffect(() => {
    if (allArtwork.length) {
      const collNames = allArtwork.map((artwork) => artwork.collection || "");
      const uniqueCollections = ["All", ...new Set(collNames)];
      setCollections(uniqueCollections);
    }
  }, [allArtwork]);

  useEffect(() => {
    if (allArtwork.length) {
      let filteredArtwork = allArtwork.filter((x) => !x.disabled);
      if (filters.collection && filters.collection !== "All") {
        filteredArtwork = filteredArtwork.filter(
          (x) => x.collection === filters.collection
        );
      }

      if (filters.artist && filters.artist !== "All") {
        filteredArtwork = filteredArtwork.filter(
          (x) => x.artist?.displayName === filters.artist
        );
      }
      setArtworks([...filteredArtwork]);
    }
  }, [allArtwork, filters]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const initialArtworks =
      filters.collection !== "All"
        ? allArtwork.filter((x) => x.collection === filters.collection)
        : allArtwork;
    if (value.trim() !== "") {
      const results = fuse.search(value).map((result) => result.item);
      setArtworks(results);
    } else {
      setArtworks([...initialArtworks]);
    }
  };

  const updateFilters = (filter: FilterType) => {
    setFilters({ ...filters, ...filter });
  };

  const redirect = (id: string) => {
    if (id) navigate(`/artwork/${id}`);
  };

  return (
    <div className="gallery-page">
      <Navbar handleChange={handleChange} />
      <div className="filter-containers">
        <div className="collections-filters">
          {collections.map((coll, index: number) => (
            <PrimaryButton
              key={index}
              inActive={coll !== filters.collection}
              onClick={() => updateFilters({ collection: coll })}
            >
              {coll}
            </PrimaryButton>
          ))}
        </div>
        <div className="other-filters">
          <div className="filter" onClick={() => updateFilters({ artist: "" })}>
            Artist
          </div>
          <Filter />
        </div>
      </div>

      <div className="artworks-container">
        {artworks.map((art: ArtworkType, index: number) => (
          <div
            key={index}
            className="art-container"
            onClick={() => redirect(art.id || "")}
          >
            <img src={art.image} alt="" />
            <div className="art-description">
              <div className="artist">
                <b>{art.name}</b> By {art.artist?.displayName}
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
