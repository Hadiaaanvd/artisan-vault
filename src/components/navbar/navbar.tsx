import React from "react";
import logo from "../../assets/logo.png";
import { useLocation, useNavigate } from "react-router-dom";

import "./navbar.scss";

type NavbarProps = {
  handleSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Navbar: React.FC<NavbarProps> = ({ handleSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
        {handleSearch && (
          <input
            type="text"
            onChange={handleSearch}
            className="search-field"
            placeholder="Search.."
          />
        )}

        <div onClick={handleRedirect} className="nav-item">
          {location.pathname === "/" ? "Sign In" : "Gallery"}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
