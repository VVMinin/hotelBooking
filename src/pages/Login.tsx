import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../utils/auth';
import styles from './Styles.module.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginUser({ username, password });
      onLogin();
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Вход</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button type="submit" style={{ width: '100%' }}>Войти</button>
      </form>
    </div>
  );
};

export default Login;
