import {useEffect,useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import Room from './pages/Room';
import Bookings from './pages/Bookings';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Register from './pages/Register';
import { getCurrentUser, logoutUser, isAdmin, getUsers, setUsers } from './utils/auth';
import './App.css';

function App() {
  const [user, setUser] = useState(getCurrentUser());
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    const allUsers = getUsers();
    if (allUsers.length === 0) {
      setUsers([{
        username: 'admin',
        password: 'admin',
        role: 'admin'
      }]);
    }
  }, []);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleUserChange = () => setUser(getCurrentUser());
    window.addEventListener('storage', handleUserChange);
    window.addEventListener('popstate', handleUserChange);
    return () => {
      window.removeEventListener('storage', handleUserChange);
      window.removeEventListener('popstate', handleUserChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App">
      <nav>
        <Link to="/">Главная</Link>
        <Link to="/rooms">Номера</Link>
        {user ? (
          <>
            <Link to="/bookings">Мои бронирования</Link>
            {isAdmin() && <Link to="/admin">Админ</Link>}
            <span>Привет, {user.username}!</span>
            <button onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login">Вход</Link>
            <Link to="/register">Регистрация</Link>
          </>
        )}
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login onLogin={() => setUser(getCurrentUser())} />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
