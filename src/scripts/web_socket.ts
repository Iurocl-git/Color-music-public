export const connectWebSocket = (ip = "192.168.190.120") => {
  const socket = new WebSocket(`ws://${ip}:81`); // Укажите правильный IP адрес и порт вашего ESP32

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
