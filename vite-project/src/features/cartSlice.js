import { createSlice } from "@reduxjs/toolkit";
import productSlice from "./productSlice";

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        cartItems: [],
        favorites: {},
    },
    reducers: {
        addToCart: (state, action) => {
            const existingItem = state.cartItems.find(
                (item) => item.id === action.payload.id
            );
            if (!existingItem) {
                state.cartItems.push(action.payload);
            }
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (item) => item.id !== action.payload
            );
        },
        toggleFavorites: (state, action) => {
            const productId = action.payload;
            // console.log(action.payload);
            state.favorites[productId] = !state.favorites[productId];
        },
    },
});

export const { addToCart, removeFromCart, toggleFavorites } = cartSlice.actions;
export default cartSlice.reducer;
