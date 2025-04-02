import { useWebSocketStore } from '@/store';

export const connectWebSocket = (ip = "192.168.85.51", secure = false) => {
  const socket = !secure ? new WebSocket(`ws://${ip}:81`) : new WebSocket(`wss://${ip}:81`); // Укажите правильный IP адрес и порт вашего ESP32
  console.log("test", secure);

  socket.onopen = () => {
    console.log("WebSocket соединение установлено");
  };

  socket.onmessage = (event: any) => {
    console.log("Получены данные с ESP32: ", event.data);
  };

  socket.onerror = (error: any) => {
    alert(error.message);
    console.error("Ошибка WebSocket: ", error);
  };

  socket.onclose = () => {
    console.log("WebSocket соединение закрыто");
  };
  return socket;
};
