import { io, type Socket } from "socket.io-client";
import type { Message } from "@/types/api";

export type MessageCreatedEvent = {
  type: "message.created";
  threadId: string;
  message: Message;
};

export type RealtimeEventHandler = (event: MessageCreatedEvent) => void;

type JoinAck = { ok: boolean; threadId?: string; error?: string };

function emitWithAck<T>(
  socket: Socket,
  event: string,
  payload: unknown,
): Promise<T> {
  return new Promise((resolve, reject) => {
    socket.timeout(5000).emit(event, payload, (error: Error | null, response: T) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(response);
    });
  });
}

export class RealtimeClient {
  private socket: Socket | null = null;
  private token: string | null = null;
  private joinedThreadId: string | null = null;
  private handlers = new Set<RealtimeEventHandler>();

  connect(token: string, wsUrl: string): void {
    if (this.token === token && this.socket?.connected) {
      return;
    }

    this.disconnect();
    this.token = token;

    this.socket = io(wsUrl, {
      path: "/socket.io",
      auth: { token },
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    this.socket.on("message.created", (payload: MessageCreatedEvent) => {
      if (!payload || payload.type !== "message.created") {
        return;
      }

      for (const handler of this.handlers) {
        handler(payload);
      }
    });

    this.socket.on("connect", () => {
      if (this.joinedThreadId) {
        void this.joinThread(this.joinedThreadId);
      }
    });
  }

  disconnect(): void {
    this.joinedThreadId = null;
    this.token = null;
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(handler: RealtimeEventHandler): () => void {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  async joinThread(threadId: string): Promise<boolean> {
    this.joinedThreadId = threadId;

    if (!this.socket?.connected) {
      return false;
    }

    try {
      const ack = await emitWithAck<JoinAck>(this.socket, "thread:join", {
        threadId,
      });
      return ack.ok === true;
    } catch {
      return false;
    }
  }

  async leaveThread(threadId: string): Promise<void> {
    if (this.joinedThreadId === threadId) {
      this.joinedThreadId = null;
    }

    if (!this.socket?.connected) {
      return;
    }

    try {
      await emitWithAck<JoinAck>(this.socket, "thread:leave", { threadId });
    } catch {
      // Best-effort leave.
    }
  }

  get isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }
}

export const realtimeClient = new RealtimeClient();
