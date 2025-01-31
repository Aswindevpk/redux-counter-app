// Importing `createSlice` and `PayloadAction` from Redux Toolkit
// `createSlice` helps create Redux slices easily, and `PayloadAction<T>` is used for typed actions
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Defining the shape of the counter state with a TypeScript interface
interface CounterState {
  value: number; // The counter will store a numeric value
}

// Defining the initial state of the counter slice
const initialState: CounterState = { value: 0 };

// Creating a Redux slice using `createSlice`
export const counterSlice = createSlice({
  name: "counter", // Name of the slice (used in Redux actions)
  initialState, // The initial state of the counter
  reducers: {
    // Action to increment the counter by 1
    increment: (state) => {
      state.value += 1;
    },
    
    // Action to decrement the counter by 1
    decrement: (state) => {
      state.value -= 1;
    },
    
    // Action to reset the counter to 0
    reset: (state) => {
      state.value = 0;
    },
    
    // Action to increment the counter by a custom amount
    // `PayloadAction<number>` ensures the payload is a number
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Exporting the action creators to be used in React components
export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions;

// Exporting the reducer to be used in the Redux store
export default counterSlice.reducer;
