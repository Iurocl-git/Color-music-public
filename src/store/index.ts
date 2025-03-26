import { create } from "zustand";
import { WebSocketStore } from "@/types/type";

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  socket: null,
  ip: "192.168.190.120",
  setIP: (ip) => set({ ip: ip }),
  setSocket: (socket) => set({ socket: socket }),
}));
