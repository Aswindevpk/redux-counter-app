// Importing `createSlice` and `PayloadAction` from Redux Toolkit
// `createSlice` helps create Redux slices easily, and `PayloadAction<T>` is used for typed actions
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState, AppDispatch } from "../../app/store";

// Defining the shape of the counter state with a TypeScript interface
interface CounterState {
  value: number; // The counter will store a numeric value
  status: "idle" | "loading" | "failed"; //status  for the counter for async action
}

// Defining the initial state of the counter slice
const initialState: CounterState = { value: 0, status: "idle" };

//Async thunk to stimulate an API call delay
export const incrementAsync = createAsyncThunk(
  "counter/incrementAsync",
  async (amount: number) => {
    return new Promise<number>((resolve) => {
      setTimeout(() => resolve(amount), 5000);
    });
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// Thunk action creator: This function returns another function that has access to dispatch and getState.
export const incrementIfOdd =
  (amount: number) => // First function takes `amount` as an argument
  (dispatch: AppDispatch, getState: () => RootState): void => { // Second function receives `dispatch` and `getState`
    
    // Retrieve the current counter value from the state
    const currentValue = getState().counter.value;

    // Check if the current value is odd
    if (currentValue % 2 !== 0) {
      // Dispatch an action to increment the counter by the specified amount
      dispatch(incrementByAmount(amount));
    }
  };


// Exporting the action creators to be used in React components
export const { increment, decrement, reset, incrementByAmount } =
  counterSlice.actions;

// Exporting the reducer to be used in the Redux store
export default counterSlice.reducer;
