import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authType } from "../../App";
import { ReactComponent as Logout } from "../../assets/logout.svg";
import logo from "../../assets/logo.png";

import "./artist-menu.scss";
import { logOutFunction } from "../../firebase";

const menuItems = [
  { link: "/artist", name: "About" },
  { link: "/artist/artwork", name: "Artwork" },
];
const ArtistMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(0);
  const { currentUser } = useSelector(
    (state: { auth: authType }) => state.auth
  );

  useEffect(() => {
    if (location.pathname === "/artist") setActiveCategory(0);
    else setActiveCategory(1);
  }, [location]);

  return (
    <div className="artist-menu-component">
      <div className="artist-menu-content-container">
        <div className="logo-and-menu-container">
          <img src={logo} alt="" />
          <div className="menu-list-container">
            {menuItems.map((item, index) => (
              <div
                key={index}
                onClick={() => navigate(item.link)}
                className={`menu-link ${
                  activeCategory === index ? "active" : ""
                }`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <div className="logout-container">
          <div className="name-container">
            <div>{currentUser.displayName}</div>
            <div>{currentUser.email}</div>
          </div>

          <Logout className="logout-icon" onClick={logOutFunction} />
        </div>
      </div>
    </div>
  );
};

export default ArtistMenu;
