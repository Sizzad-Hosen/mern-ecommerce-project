import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    allCategory: [],
    loadingCategory: false,
    allSubCategory: [],
    product: []
};

const productSlice = createSlice({
    name: 'product',
    initialState: initialValue,
    reducers: {
        setAllCategory: (state, action) => {
            console.log("Dispatching categories:", action.payload); // Log the data being dispatched
            state.allCategory = action.payload;
          },
          
        setLoadingCategory: (state, action) => {
            state.loadingCategory = action.payload;
        },
        setAllSubCategory: (state, action) => {
            state.allSubCategory = action.payload;
        },
    },
});

export const { setAllCategory, setAllSubCategory, setLoadingCategory } = productSlice.actions;

export default productSlice.reducer;
