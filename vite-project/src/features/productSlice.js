// import { createSlice } from "react-redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    loading: false,
    hasMore: true,
    page: 1,
    error: null,
};

export const fetchProducts = createAsyncThunk(
    "c/5e06-e209-449f-a485/",
    async (page, { rejectWithValue }) => {
        try {
            const response = await fetch(
                "https://dummyjson.com/c/5e06-e209-449f-a485"
            );
            const data = await response.json();
            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
