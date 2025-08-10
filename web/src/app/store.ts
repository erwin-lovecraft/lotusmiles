import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "@/features/counter/counterSlice.ts";
import profileReducer from "@/features/profile/profileSlice.ts";
import { errorToastMiddleware } from "./error-toast-middleware";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorToastMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
