export interface WebSocketStore {
  socket: WebSocket | null; // The WebSocket connection (can be null initially)
  ip: string;
  secure: boolean;
  setSecure: (secure: boolean) => void;
  setIP: (ip: string) => void; // Function to set the WebSocket connection
  setSocket: (socket: WebSocket) => void; // Function to set the WebSocket connection
  // sendMessage: (message: string) => void;   // Function to send a message via WebSocket
  // closeSocket: () => void;   // Function to close the WebSocket connection
}
