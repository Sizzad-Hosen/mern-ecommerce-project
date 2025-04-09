const { createSlice } = require("@reduxjs/toolkit")


const initialState = {
    cart:[]
}


const cartSlice = createSlice({
    name:"cartItem",
    initialState:initialState,
    reducers:{
        handleAddToCart:(state,action)=>{
            state.cart = [...action.payload]
        }
    }
})

export const {handleAddToCart} = cartSlice.actions;

export default cartSlice.reducer