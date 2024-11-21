import { io, Socket } from "socket.io-client";

class SocketApi {
  static socket: null | Socket = null;

  static createConnection(): void {
    const token = localStorage.getItem("token");
    this.socket = io("http://localhost:3000", {
      auth: {
        token: token,
      },
    });

    this.socket.on("connect", () => {
      console.log("Соединение установлено с сервером");
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Соединение разорвано:", reason);
    });

    this.socket.on("error", (error) => {
      console.error("Ошибка соединения:", error);
    });
  }
}
export default SocketApi;