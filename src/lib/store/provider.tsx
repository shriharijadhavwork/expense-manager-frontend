"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { fetchThreads } from "@/lib/store/thread-slice";
import { useAppDispatch } from "@/lib/store/hooks";
import { THREADS_CHANGED_EVENT } from "@/lib/chat/thread-events";

function ThreadStoreListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void dispatch(fetchThreads());
    });

    return () => window.cancelAnimationFrame(frame);
  }, [dispatch]);

  useEffect(() => {
    const refresh = () => {
      void dispatch(fetchThreads());
    };

    window.addEventListener(THREADS_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener(THREADS_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [dispatch]);

  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThreadStoreListener />
      {children}
    </Provider>
  );
}
