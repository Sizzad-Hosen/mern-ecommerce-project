import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, 
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; 
    },

    setUserDetails: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; 
      }
    },

    updatedAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload; 
      }
    },

    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setUserDetails, updatedAvatar, clearUser } = userSlice.actions;
export default userSlice.reducer;
