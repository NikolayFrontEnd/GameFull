import { useEffect, useState } from "react";
import SocketApi from "../api/socket-api";

// Интерфейс для сообщения
interface Message {
  text: string;
  senderId: string;
  timestamp: string;
}

export const useConnectSocket = () => {
    const [messages, setMessages] = useState<Message[]>([]);
  
    const connectSocket = () => {
      SocketApi.createConnection();
  
      // Слушаем событие "client-path" для получения сообщений
      if (SocketApi.socket) {
        SocketApi.socket.on("client-path", (data: Message) => {
          console.log("Получено сообщение с сервера:", data); // Должно сработать
          setMessages((prevMessages) => [...prevMessages, data]);
        });
      } else {
        console.error("Socket connection not established.");
      }
    };
  
    useEffect(() => {
      connectSocket();
    }, []);
  
    return { messages };
  };