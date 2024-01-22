import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import artworkReducer from "./artwork/artwork.reducer";
import authReducer from "./auth/auth.reducer";

const appReducer = combineReducers({
  firestore: firestoreReducer,
  art: artworkReducer,
  auth: authReducer,
});

const rootReducer = (state: any, action: { type: string }) => {
  if (action.type === "RESET_REDUX_STORE") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
