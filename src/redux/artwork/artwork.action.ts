import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../store";

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
