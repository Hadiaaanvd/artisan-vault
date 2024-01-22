const INITIAL_STATE = {
  currentUser: {},
  updateUserLoading: { loading: false, success: false, error: null },
};

const authReducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "UPDATE_USER_LOADING":
      return { ...state, updateUserLoading: action.payload };
    default:
      return state;
  }
};

export default authReducer;
