import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = {
                uid: action.payload.uid,
                email: action.payload.email,
            }; //it stores the user data
            // console.log(action.payload);
        },
        logout: (state) => {
            state.user = null; //it clears the user data
        },
    },
});

export const { login, logout } = authSlice.actions; //it exports the actions
export default authSlice.reducer; //it exports the reducer
