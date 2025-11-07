import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../utils/auth';
import styles from './Styles.module.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return 'Пароль должен содержать не менее 6 символов.';
    }
    if (/\s/.test(pass)) {
      return 'Пароль не должен содержать пробелов.';
    }
    if (!/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(pass)) {
      return 'Пароль может содержать только латиницу, цифры и спецзнаки.';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    try {
      registerUser({ username, password, role: 'user' });
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Имя пользователя</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Пароль</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Подтвердите пароль</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <button type="submit" style={{ width: '100%' }}>Зарегистрироваться</button>
      </form>
    </div>
  );
};

export default Register;
