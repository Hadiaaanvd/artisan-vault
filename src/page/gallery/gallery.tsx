import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Filter } from "../../assets/filter.svg";
import { ArtworkType } from "../artwork/artwork";

import Fuse from "fuse.js";
import Navbar from "../../components/navbar/navbar";
import PrimaryButton from "../../components/primary-button/primary-button";
import SelectField from "../../components/select-field/select-field";
import "./gallery.scss";

export type FilterType = { artist?: string; collection?: string };
type artType = { art: { artwork: ArtworkType[] } };
const initialFilters = { collection: "All", artist: "All" };
const searchableKeys = ["name", "collection", "price", "artist.displayName"];

const Gallery: React.FC = () => {
  const navigate = useNavigate();
  const allArtwork = useSelector((state: artType) => state.art.artwork);
  const [artworks, setArtworks] = useState<ArtworkType[]>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterType>(initialFilters);
  const fuse = new Fuse(allArtwork, { keys: searchableKeys });

  useEffect(() => {
    if (allArtwork.length) {
      const collNames = allArtwork.map((artwork) => artwork.collection || "");
      const artistNames = allArtwork.map(
        (artwork) => artwork.artist?.displayName || ""
      );
      const uniqueCollections = ["All", ...new Set(collNames)];
      const uniqueArtists = ["All", ...new Set(artistNames)];
      setCollections(uniqueCollections);
      setArtists(uniqueArtists);
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
    } else setArtworks([...initialArtworks]);
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
              onClick={() => setFilters({ ...filters, collection: coll })}
            >
              {coll}
            </PrimaryButton>
          ))}
        </div>
        <div className="other-filters">
          <SelectField
            options={artists}
            value={filters.artist || ""}
            handleChange={(value) => setFilters({ ...filters, artist: value })}
          />

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
