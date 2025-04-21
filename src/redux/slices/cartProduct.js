import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: []
};

const cartSlice = createSlice({
    name: "cartItem",
    initialState,
    reducers: {
        handleAddToCart: (state, action) => {
            // Add the new item to the existing cart array
            state.cart.push(action.payload);
        }
    }
});

export const { handleAddToCart } = cartSlice.actions;

export default cartSlice.reducer;
