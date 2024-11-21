import { ChangeEvent, useState } from 'react';
import styles from './people.module.css'
import axios, { AxiosResponse } from 'axios'; // Убедитесь, что axios установлен: npm install axios
import { Link } from 'react-router-dom';

interface User {
  id: number;
  name: string;
  score: number;
  success: number;
  unsuccess: number;
}

const People: React.FC = () => {
  // Состояния с типами
  const [name, setName] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [show, Setshow] = useState<boolean>(false)
  // Предполагается, что токен хранится в localStorage
  const token: string | null = localStorage.getItem('token');

  // Обработчик изменения ввода
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setName(e.target.value);
  };

  // Обработчик поиска
  const handleSearch = async (): Promise<void> => {
    try {
      // Проверка, что введено имя
      if (!name.trim()) {
        setErrorMessage('Введите имя пользователя');
        return;
      }

      // Запрос к бэкенду
      const response: AxiosResponse<User[] | { message: string }> = await axios.get(
        'http://localhost:3000/user/AllUsers',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
         params:  {name },
        }
      );
console.log(response.data);
console.log(name)
      // Проверка ответа
      if ('message' in response.data) {
        // Если получено сообщение об ошибке
        setErrorMessage(response.data.message);
        setUsers([]);
      } else {
        // Если пользователи найдены
        setUsers(response.data);
        setErrorMessage(null);
        Setshow(true);
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при поиске пользователей');
    }
  };

  return (
    <>
      <div className={styles.headerInput}>
        <div className={styles.input}>
          <input
            type="text"
            placeholder="Введите имя пользователя:"
            value={name}
            onChange={handleInputChange}
          />
        </div>
        <button className={styles.button} onClick={handleSearch}>
          Поиск
        </button>
      </div>

      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
{show &&<h2>Все пользователи с таким именем:</h2>}
      <div className={styles.cards}>
        {users.map((user) => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.box}>
              <div>
                <div>{user.name}</div>
                <div>Число очков: {user.score}</div>
                <div>Успешных игр: {user.success}</div>
                <div>Неуспешных игр: {user.unsuccess}</div>
              </div>
<Link to={`/chat/${user.id}/${user.name}`}>
<button className={styles.btn}>Написать</button>
</Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
export default People;