import { UserType } from "../../App";
import { AppThunk } from "../artwork/artwork.action";

export const setCurrentUser = (user: {
  providerData?: {};
  displayName?: string;
  uid?: string;
  email?: string;
  authLoaded: boolean;
  authenticated: boolean;
  photoUrl?: string;
}) => ({
  type: "SET_CURRENT_USER",
  payload: user,
});

export const updateArtistInfo =
  (userData: UserType): AppThunk =>
  async (dispatch, getState, { getFirebase }) => {
    console.log("hereeee");
    dispatch({
      type: "UPDATE_USER_LOADING",
      payload: { loading: true, success: false, error: null },
    });
    const db = getFirebase();
    const updateArtistAbout = db.functions().httpsCallable("updateArtistAbout");
    try {
      const result = await updateArtistAbout(userData);
      const resp = result.data;
      console.log("resp", resp);
      if (resp.success) {
        dispatch({
          type: "UPDATE_USER_LOADING",
          payload: { loading: false, success: true, error: null },
        });
      } else {
        throw resp;
      }
    } catch (error: any) {
      console.error("Error updating user information:", error);
      dispatch({
        type: "UPDATE_USER_LOADING",
        payload: { loading: false, success: false, error: error.message },
      });
    }
  };
