import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchArtworks } from "./redux/artwork/artwork.action";
import { AppDispatch } from "./redux/store";

import firebase, { addUserNameEmailOAuth } from "./firebase";
import { setCurrentUser } from "./redux/auth/auth.action";

import Auth from "./page/auth/auth";
import Artwork from "./page/artwork/artwork";
import Gallery from "./page/gallery/gallery";
import Navbar from "./components/navbar/navbar";
import ArtistMenu from "./components/artisit-menu/artist-menu";
import ArtistAbout from "./page/artist-about/artist-about";
import ArtistArtwork from "./page/artist-artwork/artist-artwork";

import "./App.scss";

export type authType = {
  currentUser: UserType;
  updateUserLoading: { loading: boolean; success: boolean; error: any };
};

export type UserType = {
  authLoaded?: boolean;
  authenticated?: boolean;
  displayName: string;
  email?: string;
  photoURL?: string;
  about?: string;
};
type userAuth = firebase.User | null;
const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector(
    (state: { auth: authType }) => state.auth
  );

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(async (userAuth: userAuth) => {
        try {
          if (userAuth) {
            const userRef = await addUserNameEmailOAuth(userAuth);
            const providerData = userAuth?.providerData ? [0] || {} : {};
            if (userRef) {
              const userObj = {
                uid: userAuth.uid,
                authLoaded: true,
                authenticated: true,
                photoURL: userAuth?.photoURL || "",
                ...providerData,
              };
              userRef.onSnapshot(
                (snapshot: firebase.firestore.DocumentSnapshot) => {
                  const data = snapshot.data();
                  dispatch(setCurrentUser({ ...userObj, ...data }));
                }
              );
            }
          } else {
            dispatch(
              setCurrentUser({
                email: "",
                displayName: "",
                authLoaded: true,
                authenticated: false,
              })
            );
          }
        } catch (err: any) {
          console.log(err.message);
        }
      });
    return () => unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchArtworks());
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        {currentUser.authLoaded ? (
          !currentUser.authenticated ? (
            <div className="public-routes">
              <Navbar />
              <Routes>
                <Route path="/" element={<Gallery />} />
                <Route path="/sign-in" element={<Auth />} />
                <Route path="*" element={<Navigate to="/" />} />
                <Route path="/artwork/:id" element={<Artwork />} />
              </Routes>
            </div>
          ) : (
            <div className="private-routes">
              <ArtistMenu />
              <Routes>
                <Route path="/artist" element={<ArtistAbout />} />
                <Route path="/artist/artwork" element={<ArtistArtwork />} />
                <Route path="*" element={<Navigate to="/artist" />} />
              </Routes>
            </div>
          )
        ) : (
          <span>Loading...</span>
        )}
      </BrowserRouter>
    </div>
  );
};

export default App;
