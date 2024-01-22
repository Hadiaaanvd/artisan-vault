// store.ts

import {
  createStore,
  applyMiddleware,
  compose,
  Store,
  Middleware,
} from "redux";
import { createLogger } from "redux-logger";
import {
  createFirestoreInstance,
  reduxFirestore,
  getFirestore,
} from "redux-firestore";
import { getFirebase } from "react-redux-firebase";
import firebase from "firebase/compat/app";
import "firebase/auth";
import "firebase/firestore";
import { firebaseConfig } from "../firebase";
import rootReducer from "./rootReducer";
import { withExtraArgument } from "redux-thunk";

import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

const logger = createLogger({
  predicate: () => true,
});

// Extend the window interface to add Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create the store with the rootReducer and middleware
const store: Store = createStore(
  rootReducer,
  composeEnhancers(
    applyMiddleware(
      withExtraArgument({ getFirebase, getFirestore }) as Middleware,
      logger
    ),
    reduxFirestore(firebase, firebaseConfig)
  )
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = ThunkDispatch<RootState, any, AnyAction>;

export const rrfProps = {
  firebase,
  config: firebaseConfig,
  dispatch: store.dispatch,
  createFirestoreInstance,
};

export default store;
