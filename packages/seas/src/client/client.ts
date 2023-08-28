const socket = new WebSocket("ws://localhost:8080");
socket.onmessage = (event) => {
  if (event.data === "reload") {
    location.reload();
  }
};
