import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import profile from "../../assets/profile.jpg";
import { ArtworkType } from "../gallery/gallery";

import "./artwork.scss";

const Artwork: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const allArtwork = useSelector(
    (state: { art: { artwork: ArtworkType[] } }) => state.art.artwork
  );
  const [artwork, setArtwork] = useState<ArtworkType>({});
  const [collection, setCollection] = useState<ArtworkType[]>([]);

  useEffect(() => {
    if (allArtwork.length) {
      const artworkTemp = { ...allArtwork.find((x) => x.id === id) };
      setArtwork(artworkTemp);
      setCollection(
        allArtwork.filter(
          (x) => x.collection === artworkTemp.collection && id !== x.id
        )
      );
    }
  }, [allArtwork, id]);

  return (
    <div className="artwork-page">
      {Object.keys(artwork).length ? (
        <div className="art-container">
          <div className="image-container">
            <img src={artwork.image} alt={artwork.name} />
          </div>
          <div className="art-description">
            <div className="description-container">
              <div className="name">
                <b>{artwork.name}</b>
              </div>
              <div className="collection">{artwork.collection}</div>
              <div className="price">{artwork.price}</div>
              <div className="description">{artwork.description}</div>
            </div>

            <div className="artist-container">
              <img src={artwork.artist?.image || profile} alt="" />
              <div>
                <b>About the Artist</b>
                <div>
                  <b>{artwork.artist?.name}</b>
                </div>
                <div>{artwork.artist?.about || ""}</div>
              </div>
            </div>

            <div className="other-collection">
              <b>More from this collection</b>
              <div className="collection-container">
                {collection
                  ? collection.map((x, index) => (
                      <div
                        key={index}
                        onClick={() => navigate(`/artwork/${x.id}`)}
                      >
                        <img src={x.image} alt={x.name} />
                        <div>{x.name}</div>
                      </div>
                    ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Artwork;