import { configureStore } from "@reduxjs/toolkit";
import threadsReducer from "@/lib/store/thread-slice";

export const store = configureStore({
  reducer: {
    threads: threadsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
