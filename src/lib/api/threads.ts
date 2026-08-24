import { apiRequest } from "@/lib/api/client";
import type { CreateThreadInput, Thread, UpdateThreadInput } from "@/types/api";

export const threadsApi = {
  list(): Promise<Thread[]> {
    return apiRequest<Thread[]>("/threads");
  },

  listRecycleBin(): Promise<Thread[]> {
    return apiRequest<Thread[]>("/threads/recycle-bin");
  },

  create(input: CreateThreadInput = {}): Promise<Thread> {
    return apiRequest<Thread>("/threads", {
      method: "POST",
      body: input,
    });
  },

  getById(id: string): Promise<Thread> {
    return apiRequest<Thread>(`/threads/${id}`);
  },

  update(id: string, input: UpdateThreadInput): Promise<Thread> {
    return apiRequest<Thread>(`/threads/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  remove(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/threads/${id}`, {
      method: "DELETE",
    });
  },

  restore(id: string): Promise<Thread> {
    return apiRequest<Thread>(`/threads/${id}/restore`, {
      method: "POST",
    });
  },

  permanentlyDelete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/threads/${id}/permanent`, {
      method: "DELETE",
    });
  },

  markRead(id: string, readAt?: string): Promise<Thread> {
    return apiRequest<Thread>(`/threads/${id}/read`, {
      method: "POST",
      body: readAt ? { readAt } : {},
    });
  },
};
