/* import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
export class SocketService implements OnGatewayConnection{

@SubscribeMessage('server-path')
handleEvent(@MessageBody() dto:any,@ConnectedSocket() client: any){
    console.log(dto);
const res = {type: "semeType", dto};
client.emit("client-path", res);
}

handleConnection(client: any):void {
    console.log(client);
    console.log("CONNECTED");
}
} */


import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import * as jwt from "jsonwebtoken";
import { jwtConstants } from "../auth/constants";
import { PrismaService } from "../prisma.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class SocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private userSocketMap: Map<number, Set<string>> = new Map(); // Сопоставление userId с набором socket.id

  constructor(private readonly prisma: PrismaService) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      // Извлекаем токен из параметров подключения
      const token = client.handshake.auth.token;
      if (!token) {
        client.disconnect();
        return;
      }

      // Проверяем и декодируем токен
      const decoded = jwt.verify(token, jwtConstants.secret);
      if (typeof decoded !== "object" || !("sub" in decoded)) {
        client.disconnect();
        return;
      }

      const userId = typeof decoded.sub === "string" ? parseInt(decoded.sub, 10) : decoded.sub;
      if (isNaN(userId)) {
        client.disconnect();
        return;
      }

      // Проверяем, существует ли пользователь в базе данных
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        client.disconnect();
        return;
      }

      // Сохраняем сопоставление userId с socket.id
      const userSockets = this.userSocketMap.get(userId) || new Set();
      userSockets.add(client.id);
      this.userSocketMap.set(userId, userSockets);
      
      console.log(`User ${userId} connected with socket ID ${client.id}`);
      console.log("Current userSocketMap:", Array.from(this.userSocketMap.entries()));

      console.log(`User ${userId} connected with socket ID ${client.id}`);
    } catch (error) {
      console.error("Authentication error", error);
      client.disconnect();
    }
  }
  handleDisconnect(client: Socket): void {
    // Удаляем запись о пользовательском сокете при отключении
    for (const [userId, socketIds] of this.userSocketMap.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        if (socketIds.size === 0) {
          this.userSocketMap.delete(userId);
        } else {
          this.userSocketMap.set(userId, socketIds);
        }
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }
  @SubscribeMessage("server-path")
  async handleEvent(
    @MessageBody() dto: { text: string; receiverId: number },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
    let { text, receiverId } = dto;
  
    // Преобразуем receiverId в число
    receiverId = Number(receiverId);
    if (isNaN(receiverId)) {
      console.error("Invalid receiver ID:", receiverId);
      return;
    }
  
    try {
      const decodedToken = jwt.verify(client.handshake.auth.token, jwtConstants.secret);
      if (typeof decodedToken !== "object" || !("sub" in decodedToken)) {
        console.error("Invalid token structure");
        return;
      }
      const senderId = typeof decodedToken.sub === "string" ? parseInt(decodedToken.sub, 10) : decodedToken.sub;
      if (isNaN(senderId)) {
        console.error("Invalid sender ID");
        return;
      }
  
      // Проверяем, существует ли получатель в базе данных
      const receiver = await this.prisma.user.findUnique({
        where: { id: receiverId },
      });
  
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
  
      // Сохраняем сообщение в базе данных
      const message = await this.prisma.message.create({
        data: {
          content: text,
          senderId, // senderId уже число
          receiverId, // receiverId уже число
        },
      });
  
      console.log(`Message sent: "${message.content}" from User ${senderId} to User ${receiverId}`);
  
      // Функция для отправки сообщения на определенные сокеты
      const emitMessage = (socketIds: Set<string>, messagePayload: any) => {
        if (socketIds && socketIds.size > 0) {
          console.log("Socket IDs found:", Array.from(socketIds));
          socketIds.forEach((socketId) => {
            console.log("Отправка сообщения клиенту:", messagePayload);
            this.server.to(socketId).emit("client-path", messagePayload);
          });
        } else {
          console.log(`No active sockets found.`);
        }
      };
  
      const messagePayload = {
        text: message.content,
        senderId,
      };
  
      // Отправляем сообщение получателю
      const receiverSocketIds = this.userSocketMap.get(receiverId);
      if (receiverSocketIds) {
        emitMessage(receiverSocketIds, messagePayload);
      } else {
        console.log(`No active sockets found for receiverId: ${receiverId}`);
      }
  
      // Отправляем сообщение отправителю
      const senderSocketIds = this.userSocketMap.get(senderId);
      if (senderSocketIds) {
        emitMessage(senderSocketIds, messagePayload);
      } else {
        console.log(`No active sockets found for senderId: ${senderId}`);
      }
  
    } catch (error) {
      console.error("Error handling event", error);
    }
  }
}