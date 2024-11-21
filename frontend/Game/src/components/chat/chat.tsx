import { useState } from 'react';
import { useConnectSocket } from '../../hooks/useConnectSocket';
import styles from './chat.module.css';
import SocketApi from '../../api/socket-api';
import { Link, useParams } from 'react-router-dom';

interface ChatParams {
  userId: string;
  userName: string;
  [key: string]: string | undefined; 
}
interface Message {
  text: string;
  senderId: string;
  timestamp: string;
}

const Chat = () => {
  const { userId, userName } = useParams<ChatParams>();
  const [text, setText] = useState("");
  const { messages } = useConnectSocket();

  // Функция для отправки сообщения
  const sendMessage = () => {
    if (text.trim() === "") return; // Проверка на пустое сообщение

    // Отправляем сообщение через сокет
    SocketApi.socket?.emit("server-path", {
      text,
      receiverId: userId,
      timestamp: new Date().toISOString(), // Отметка времени
    });

    // Очищаем текстовое поле
    setText("");
  };

  return (
    <>
      <div className={styles.container222}>
        <div style={{ display: "flex", flex: 1 }}>
          <aside className={styles.leftBar}>
            <Link to="/main">
              <button className={styles.btn123}>Назад</button>
            </Link>
            <div className={styles.text2}>Вы переписывались:</div>
            <div className={styles.friendsList}>
              <div className={styles.friendItem}>Николай Олегович</div>
              <div className={styles.friendItem}>Николай Дмитриевич</div>
              <div className={styles.friendItem}>Николай Витальевич</div>
            </div>
          </aside>

          <main className={styles.mainChat}>
            <div className={styles.header}>
              <div>{userName}</div>
              <div>Был в сети: 5 минут назад</div>
            </div>
            <div className={styles.messages}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`${styles.message} ${
                    msg.senderId === "me" ? styles.self : styles.other
                  }`}
                >
                  {msg.text}
                  <span className={styles.timestamp}>
                    {new Date(msg.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <footer>
              <input
                type="text"
                placeholder="Введите свое сообщение"
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
              />
              <button onClick={sendMessage} className={styles.button111}>
                Отправить сообщение
              </button>
            </footer>
          </main>
        </div>
      </div>
    </>
  );
};
export default Chat;