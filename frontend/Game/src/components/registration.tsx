import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Для перенаправления пользователя
import styles from './App2.module.css'; // Предполагается, что стили подключены
const Registration = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Отправляем запрос на регистрацию
      const response = await axios.post('http://localhost:3000/user/register', {
        name,
        email,
        password,
      });

      // Если регистрация успешна, перенаправляем на страницу входа
      navigate('/login'); // Переход на страницу авторизации
      console.log(response.data)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка регистрации');
    }
  };
const Log = () =>{
  navigate('/login');
}
  return (
    <div id="registration-form" className={styles.registrationForm}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Registration</legend>
        <form onSubmit={handleSubmit}>
          <div className={styles.row}>
            <label htmlFor="name" className={styles.label}>
             Имя
            </label>
            <input
              type="text"
              placeholder="Ваше имя:"
              name="name"
              id="name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="email" className={styles.label}>
              E-mail
            </label>
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.row}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              name="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitButton}>
            Зарегестрироваться
          </button>
          <button onClick = {Log} className={styles.submitButton2}>
            Есть аккаунт?
          </button>
        </form>
      </fieldset>
    </div>
  );
};

export default Registration;
