import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import firebase from "../../firebase";
import logo from "../../assets/logo.png";
import { ReactComponent as Google } from "../../assets/google.svg";

import "./auth.scss";

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [errMessage, setErrMessage] = useState("");

  const googleAuth = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (err: any) {
      console.log(err.message);
      setErrMessage(err.message);
    }
  };
  return (
    <div className="auth-page">
      <div className="signin-container">
        <img onClick={() => navigate("/")} className="logo" src={logo} alt="" />

        <div className="google-button-container">
          Begin your creative journey with Artisan Vault. Click below to access
          your account with Google and add your masterpieces in our exclusive
          gallery.
          <div className="google-button" onClick={() => googleAuth()}>
            <Google /> Signin with Google
          </div>
          <p className="error-message">{errMessage}</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
