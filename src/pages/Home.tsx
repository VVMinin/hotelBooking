import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Styles.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles.container} style={{ textAlign: 'center' }}>
      <h1>Добро пожаловать в наш отель!</h1>
      <p>Мы предлагаем лучшие номера для вашего отдыха.</p>
      <p>Пожалуйста, ознакомьтесь с нашими предложениями.</p>
      <Link to="/rooms">
        <button style={{ marginTop: '20px' }}>Посмотреть доступные номера</button>
      </Link>
    </div>
  );
};

export default Home;
