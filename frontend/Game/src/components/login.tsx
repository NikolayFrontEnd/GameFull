import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './App2.module.css'; // Подключение стилей

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Отправляем запрос на вход
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      // Сохраняем JWT-токен в localStorage или sessionStorage
      localStorage.setItem('token', response.data.access_token);

      console.log(response.data)
      // Перенаправляем пользователя на главную страницу
      navigate('/main');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div id="login-form" className={styles.loginForm}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Login</legend>
        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
      </fieldset>
    </div>
  );
};

export default Login;
