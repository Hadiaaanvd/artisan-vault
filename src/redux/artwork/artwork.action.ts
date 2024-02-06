import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";
import { ArtworkType } from "../../page/artwork/artwork";

export type ArtworkData = {
  id: string;
  [key: string]: any;
};

export type ArtworkLoading = {
  loading: boolean;
  success: boolean;
  error: any;
};

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  { getFirestore: any; getFirebase: any },
  Action<string>
>;

export const fetchArtworks =
  (): AppThunk =>
  async (dispatch, getState, { getFirestore }) => {
    try {
      dispatch({
        type: "SET_ARTWORK_LOADING",
        payload: { loading: true, success: false, error: null },
      });
      const firestore = getFirestore();
      firestore.collection("Artwork").onSnapshot(async (querySnapshot: any) => {
        const artwork: ArtworkData[] = [];
        querySnapshot.forEach(
          (doc: { id: string; empty: boolean; data: () => {} }) => {
            if (!doc.empty) {
              const artworkFromDb: ArtworkData = {
                id: doc.id,
                ...doc.data(),
              };

              artwork.push(artworkFromDb);
            } else {
              const errorObject =
                "No artwork added yet. Please check back letter";
              throw errorObject;
            }
          }
        );

        dispatch({
          type: "SET_ARTWORK",
          payload: artwork,
        });
      });
    } catch (err: any) {
      console.log(err.message);
      dispatch({
        type: "FETCH_CAUSE_DATA_LOADING",
        payload: {
          loading: false,
          success: true,
          error: err.message,
        },
      });
    }
  };

export const updateArtworkStatus =
  (id?: string, disabled?: boolean): AppThunk =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    dispatch({
      type: "SET_ARTWORK_STATUS_LOADING",
      payload: { loading: true, success: false, error: null },
    });
    const db = getFirebase();
    try {
      const updateArtworkStatus = db
        .functions()
        .httpsCallable("updateArtworkStatus");
      await updateArtworkStatus({ id, disabled });
    } catch (err: any) {
      console.log(err.message);
      dispatch({
        type: "SET_ARTWORK_STATUS_LOADING",
        payload: {
          loading: false,
          success: true,
          error: err.message,
        },
      });
    }
  };
export const updateArtworkDetails =
  (data?: ArtworkType, disabled?: boolean): AppThunk =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    console.log(data);
    dispatch({
      type: "SET_UPDATE_ARTWORK_LOADING",
      payload: { loading: true, success: false, error: null },
    });
    const db = getFirebase();
    try {
      const updateArtwork = db.functions().httpsCallable("updateArtwork");
      await updateArtwork(data);
      dispatch({
        type: "SET_UPDATE_ARTWORK_LOADING",
        payload: {
          loading: false,
          success: true,
          error: false,
        },
      });
    } catch (err: any) {
      console.log(err.message);
      dispatch({
        type: "SET_UPDATE_ARTWORK_LOADING",
        payload: {
          loading: false,
          success: false,
          error: err.message,
        },
      });
    }
  };

export const resetArtworkLoading = () => ({
  type: "SET_UPDATE_ARTWORK_LOADING",
  payload: { loading: false, success: false, error: "" },
});
