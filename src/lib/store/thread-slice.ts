import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { threadsApi } from "@/lib/api/threads";
import type { Thread } from "@/types/api";

type ThreadsState = {
  byId: Record<string, Thread>;
  listIds: string[];
  listStatus: "idle" | "loading" | "success" | "error";
};

const initialState: ThreadsState = {
  byId: {},
  listIds: [],
  listStatus: "idle",
};

function mergeThreadList(state: ThreadsState, threads: Thread[]): void {
  for (const thread of threads) {
    state.byId[thread.id] = thread;
  }

  state.listIds = threads.map((thread) => thread.id);
}

export const fetchThreads = createAsyncThunk("threads/fetchList", async () => {
  return threadsApi.list();
});

export const fetchThread = createAsyncThunk(
  "threads/fetchOne",
  async (threadId: string) => {
    return threadsApi.getById(threadId);
  },
);

export const renameThread = createAsyncThunk(
  "threads/rename",
  async ({ threadId, title }: { threadId: string; title: string }) => {
    return threadsApi.update(threadId, { title });
  },
);

export const deleteThread = createAsyncThunk(
  "threads/delete",
  async (threadId: string) => {
    await threadsApi.remove(threadId);
    return threadId;
  },
);

export const markThreadRead = createAsyncThunk(
  "threads/markRead",
  async ({
    threadId,
    readAt,
  }: {
    threadId: string;
    readAt?: string;
  }) => {
    return threadsApi.markRead(threadId, readAt);
  },
);

const threadsSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    upsertThread(state, action: PayloadAction<Thread>) {
      const thread = action.payload;
      state.byId[thread.id] = thread;

      if (
        thread.type !== "group" &&
        !state.listIds.includes(thread.id)
      ) {
        state.listIds.unshift(thread.id);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.pending, (state) => {
        state.listStatus = "loading";
      })
      .addCase(fetchThreads.fulfilled, (state, action) => {
        mergeThreadList(state, action.payload);
        state.listStatus = "success";
      })
      .addCase(fetchThreads.rejected, (state) => {
        state.listStatus = "error";
      })
      .addCase(fetchThread.fulfilled, (state, action) => {
        state.byId[action.payload.id] = action.payload;
      })
      .addCase(renameThread.fulfilled, (state, action) => {
        state.byId[action.payload.id] = action.payload;
      })
      .addCase(deleteThread.fulfilled, (state, action) => {
        delete state.byId[action.payload];
        state.listIds = state.listIds.filter((id) => id !== action.payload);
      })
      .addCase(markThreadRead.fulfilled, (state, action) => {
        state.byId[action.payload.id] = action.payload;
      });
  },
});

export const { upsertThread } = threadsSlice.actions;

type ThreadSliceRootState = {
  threads: ThreadsState;
};

export const selectThreadById = (state: ThreadSliceRootState, threadId: string) =>
  state.threads.byId[threadId];

export const selectThreadList = (state: ThreadSliceRootState): Thread[] =>
  state.threads.listIds
    .map((id) => state.threads.byId[id])
    .filter(
      (thread): thread is Thread =>
        Boolean(thread) && thread.type !== "group",
    );

export const selectThreadsListStatus = (state: ThreadSliceRootState) =>
  state.threads.listStatus;

export default threadsSlice.reducer;
