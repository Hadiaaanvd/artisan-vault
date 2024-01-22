const INITIAL_STATE = {
  artwork: [],
  artworkLoading: {
    loading: false,
    success: false,
    error: null,
  },
};

const artworkReducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_ARTWORK":
      return { ...state, artwork: action.payload };
    case "SET_ARTWORK_LOADING":
      return { ...state, artworkLoading: action.payload };
    default:
      return state;
  }
};

export default artworkReducer;
