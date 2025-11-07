import React, { useState, useEffect } from 'react';
import { isAdmin, getUsers, updateUser, deleteUser } from '../utils/auth';
import { getRooms, addRoom, deleteRoom, updateRoom } from '../utils/rooms';
import { getBookings } from '../utils/bookings';
import styles from './Styles.module.css';

type Room = {
  id: string;
  name: string;
  price: number;
  images: string[];
  roomCount: number;
  description: string;
};
type User = { username: string; password: string; role: string; };

const Admin: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomPrice, setNewRoomPrice] = useState('');
  const [newRoomImages, setNewRoomImages] = useState<string[]>([]);
  const [newRoomCount, setNewRoomCount] = useState('1');
  const [newRoomDescription, setNewRoomDescription] = useState('');

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => { reloadData(); }, []);

  const reloadData = () => {
    setRooms(getRooms());
    setBookings(getBookings());
    setUsers(getUsers());
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): Promise<string[]> => {
    const files = e.target.files;
    if (!files || files.length === 0) return Promise.resolve([]);

    const imagePromises = Array.from(files).map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1024;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_WIDTH) {
                width *= MAX_WIDTH / height;
                height = MAX_WIDTH;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) return reject('Could not get canvas context');

            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.8));
          };
          img.onerror = reject;
          img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    return Promise.all(imagePromises).finally(() => {
      e.target.value = '';
    });
  };

  const handleAddRoom = () => {
    setError('');
    if (!newRoomName.trim() || !newRoomPrice.trim()) {
      setError("Название и цена не могут быть пустыми.");
      return;
    }
    const price = parseInt(newRoomPrice);
    if (isNaN(price) || price < 0) {
      setError("Цена должна быть положительным числом.");
      return;
    }
    addRoom({
      id: Date.now().toString(),
      name: newRoomName,
      price: price,
      images: newRoomImages,
      roomCount: parseInt(newRoomCount),
      description: newRoomDescription
    });
    reloadData();
    setNewRoomName(''); setNewRoomPrice(''); setNewRoomImages([]); setNewRoomCount('1'); setNewRoomDescription('');
  };

  const handleStartEditRoom = (room: any) => {
    setError('');
    const images = room.images || (room.image ? [room.image] : []);
    setEditingRoom({ ...room, images, roomCount: room.roomCount || 1, description: room.description || '' });
  };

  const handleUpdateRoom = () => {
    if (!editingRoom) return;
    setError('');

    if (!editingRoom.name.trim() || editingRoom.price.toString().trim() === '') {
      setError("Название и цена не могут быть пустыми.");
      return;
    }
    const price = Number(editingRoom.price);
    if (isNaN(price) || price < 0) {
      setError("Цена должна быть корректным положительным числом.");
      return;
    }

    updateRoom(editingRoom);
    setEditingRoom(null);
    reloadData();
  };

  const handleStartEditUser = (user: User) => setEditingUser({ ...user });
  const handleUpdateUser = () => {
    if (!editingUser) return;
    updateUser(editingUser.username, { password: editingUser.password });
    setEditingUser(null);
    reloadData();
  };
  const handleDeleteUser = (username: string) => {
    if (username === 'admin') return;
    deleteUser(username);
    reloadData();
  };

  if (!isAdmin()) return <div className={styles.container}>Нет доступа</div>;

  return (
    <div className={styles.container}>
      <h1>Панель администратора</h1>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {editingRoom && (
          <div className={styles.modal}>
              <div className={styles.modalContent}>
                  <h2>Редактировать номер</h2>
                  <input value={editingRoom.name} onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})} placeholder="Название" />
                  <input type="number" min="0" value={editingRoom.price} onChange={(e) => setEditingRoom({...editingRoom, price: Number(e.target.value)})} placeholder="Цена" />
                  <input type="number" min="1" value={editingRoom.roomCount} onChange={(e) => setEditingRoom({...editingRoom, roomCount: Number(e.target.value)})} placeholder="Кол-во комнат" />
                  <textarea value={editingRoom.description} onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})} placeholder="Описание"></textarea>
                  <input type="file" multiple onChange={async (e) => {
                      const newImages = await handleImageUpload(e);
                      setEditingRoom(prevRoom => prevRoom ? {...prevRoom, images: [...prevRoom.images, ...newImages]} : null);
                  }} />
                  <div className={styles.imagePreviewContainer}>
                      {editingRoom.images.map((img, i) => (
                          <div key={i} className={styles.imagePreview}>
                              <img src={img} alt={`preview ${i}`} />
                              <button onClick={() => setEditingRoom(prevRoom => prevRoom ? {...prevRoom, images: prevRoom.images.filter((_, idx) => idx !== i)} : null)}>Удалить</button>
                          </div>
                      ))}
                  </div>
                  <button onClick={handleUpdateRoom}>Сохранить</button>
                  <button onClick={() => setEditingRoom(null)}>Отмена</button>
              </div>
          </div>
      )}

      {editingUser && (
          <div className={styles.modal}>
              <div className={styles.modalContent}>
                  <h2>Редактировать пользователя: {editingUser.username}</h2>
                  <label>Новый пароль:</label>
                  <input type="text" value={editingUser.password} onChange={(e) => setEditingUser({...editingUser, password: e.target.value})} />
                  <button onClick={handleUpdateUser}>Сохранить пароль</button>
                  <button onClick={() => setEditingUser(null)}>Отмена</button>
              </div>
          </div>
      )}

      <h2>Добавить номер</h2>
      <div className={styles.adminForm}>
        <input type="text" placeholder="Название" value={newRoomName} onChange={(e) => setNewRoomName(e.target.value)} />
        <input type="number" min="0" placeholder="Цена" value={newRoomPrice} onChange={(e) => setNewRoomPrice(e.target.value)} />
        <input type="number" min="1" placeholder="Кол-во комнат" value={newRoomCount} onChange={(e) => setNewRoomCount(e.target.value)} />
        <textarea placeholder="Описание" value={newRoomDescription} onChange={(e) => setNewRoomDescription(e.target.value)}></textarea>
        <label>Изображения:</label>
        <input type="file" multiple onChange={async (e) => {
            const newImages = await handleImageUpload(e);
            setNewRoomImages(prevImages => [...prevImages, ...newImages]);
        }} />
        <div className={styles.imagePreviewContainer}>
            {newRoomImages.map((image, index) => (
              <div key={index} className={styles.imagePreview}>
                <img src={image} alt={`Preview ${index}`} />
                <button onClick={() => setNewRoomImages(prevImages => prevImages.filter((_, i) => i !== index))}>Удалить</button>
              </div>
            ))}
        </div>
        <button onClick={handleAddRoom}>Добавить</button>
      </div>

      <h2>Зарегистрированные пользователи</h2>
      <div className={styles.userList}>
          {users.map(user => (
              <div key={user.username} className={styles.userCard}>
                  <span>Имя: {user.username}</span>
                  <span>Роль: {user.role}</span>
                  <div className={styles.adminActions}>
                      <button onClick={() => handleStartEditUser(user)}>Изменить</button>
                      <button onClick={() => handleDeleteUser(user.username)} disabled={user.username === 'admin'}>Удалить</button>
                  </div>
              </div>
          ))}
      </div>
      <h2>Все номера</h2>
      <div className={styles.grid}>
        {rooms.map(room => (
          <div key={room.id} className={styles.card}>
            {room.images && room.images.length > 0 && <img src={room.images[0]} alt={room.name} style={{ maxWidth: '100%', height: 'auto' }} />}
            <h3>{room.name}</h3>
            <p>Цена: {room.price} руб.</p>
            <div className={styles.adminActions}>
              <button onClick={() => handleStartEditRoom(room)}>Редактировать</button>
              <button onClick={() => {deleteRoom(room.id); reloadData();}}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
      <h2>Все бронирования</h2>
      <div className={styles.grid}>
        {bookings.map(booking => (
          <div key={booking.id} className={styles.card}>
            <h3>{booking.roomName}</h3>
            <p>Пользователь: {booking.userId}</p>
            <p>Заезд: {booking.checkIn}</p>
            <p>Выезд: {booking.checkOut}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
