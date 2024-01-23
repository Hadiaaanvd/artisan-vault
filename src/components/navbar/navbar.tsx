import React, { useState } from "react";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

import "./navbar.scss";

type NavbarProps = {
  handleChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Navbar: React.FC<NavbarProps> = ({ handleChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleRedirect = () => {
    location.pathname === "/" ? navigate("/sign-in") : navigate("/");
  };

  return (
    <nav className="navbar-component">
      <div className="navbar-container">
        <img
          src={logo}
          className="navbar-logo"
          onClick={() => navigate("/")}
          alt="Logo"
        />
        {location.pathname === "/" && (
          <input
            type="text"
            onChange={handleChange}
            className="search-field"
            placeholder="Search.."
          />
        )}
        <div className={`nav-menu ${isOpen ? "open" : ""}`}>
          <ul>
            <li onClick={handleRedirect} className="nav-item">
              {location.pathname === "/" ? "Sign In" : "Gallery"}
            </li>
          </ul>
        </div>
        <div className="navbar-toggler" onClick={handleToggle}>
          <span className="toggler-icon">{isOpen ? "✕" : "☰"}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
