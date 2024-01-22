import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/functions";
import "firebase/compat/auth";
import { checkForErrors } from "./utils/checkForErrors";

const firebaseConfig: any = {
  apiKey: "AIzaSyC4KESbYWAHtTZOMtMb9vKK5zXaqrCyf00",
  authDomain: "artisan-vault.firebaseapp.com",
  projectId: "artisan-vault",
  storageBucket: "artisan-vault.appspot.com",
  messagingSenderId: "211935483339",
  appId: "1:211935483339:web:b2e992dcb98e91e737524e",
  measurementId: "G-59KKD0CTES",
};

require("firebase/functions");

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const functions = firebase.functions();

export const addUserNameEmailOAuth = async (userAuth: firebase.User | null) => {
  if (!userAuth) return;
  const userRef = firebase.firestore().doc(`Users/${userAuth.uid}`);
  try {
    const functions = firebase.functions();
    const checkAndUpdateAuth = functions.httpsCallable("checkAndUpdateAuth");

    const userAuthData = {
      displayName: userAuth.displayName,
      email: userAuth.email,
      createdAt: userAuth.metadata?.creationTime,
    };

    const resp = await checkAndUpdateAuth(userAuthData);
    checkForErrors(resp.data);

    return userRef;
  } catch (err: any) {
    console.log("Error inside user update function", err.message);
    return userRef;
  }
};

export const logOutFunction = async () => {
  await auth.signOut();
};

export default firebase;
export { firebaseConfig };
