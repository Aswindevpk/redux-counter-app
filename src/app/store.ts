// Importing `configureStore` from Redux Toolkit, which simplifies store creation
import {Action,ThunkAction, configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";
import usersReducer from "../features/users/usersSlice";
import authReducer from "../features/auth/authSlice"
import notificationReducer from "../features/notifications/notificationsSlice"

import { listenerMiddleware } from "./listenerMiddleware";

// Creating the Redux store using `configureStore`
export const store = configureStore({
  reducer: {
    posts:postsReducer,
    users:usersReducer,
    auth:authReducer,
    notifications:notificationReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware)
});



// Defining a TypeScript type `RootState` that represents the entire state of the Redux store
export type RootState = ReturnType<typeof store.getState>;
// `store.getState` returns the current state object, and `ReturnType<>` infers its structure

// Defining `AppDispatch`, which represents the dispatch function type for the Redux store
export type AppDispatch = typeof store.dispatch;
// This helps when using TypeScript in components to ensure correct dispatch typing

// Export a reusable type for handwritten thunks
export type AppThunk = ThunkAction<void,RootState,unknown,Action>


