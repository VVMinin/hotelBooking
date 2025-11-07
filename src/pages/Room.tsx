import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById } from '../utils/rooms';
import { addBooking } from '../utils/bookings';
import { getCurrentUser } from '../utils/auth';
import styles from './Styles.module.css';

const Room: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<any>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numPeople, setNumPeople] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundRoom = getRoomById(id);
      setRoom(foundRoom);
    }
  }, [id]);

  const handleBooking = () => {
    setError('');
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!room || !checkIn || !checkOut) {
      setError('Пожалуйста, выберите даты заезда и выезда.');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
        setError('Дата выезда должна быть позже даты заезда.');
        return;
    }

    addBooking({
      id: Date.now().toString(),
      userId: currentUser.username,
      roomId: room.id,
      roomName: room.name,
      checkIn,
      checkOut,
      numPeople
    });
    navigate('/bookings');
  };

  if (!room) {
    return <div className={styles.container}>Номер не найден</div>;
  }

  const today = new Date().toISOString().split('T')[0];

  const getMinCheckOutDate = () => {
    if (!checkIn) return today;
    const checkInDate = new Date(checkIn);
    checkInDate.setDate(checkInDate.getDate() + 1);
    return checkInDate.toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <h1>{room.name}</h1>

      {room.images && room.images.length > 0 && (
        <div className={styles.gallery}>
          {room.images.map((image: string, index: number) => (
            <img key={index} src={image} alt={`${room.name} - ${index + 1}`} />
          ))}
        </div>
      )}

      <div className={styles.details}>
        <p><strong>Цена:</strong> {room.price} руб./ночь</p>
        <p><strong>Количество комнат:</strong> {room.roomCount || 1}</p>
        <h3>Описание</h3>
        <p>{room.description || 'Описание отсутствует.'}</p>
      </div>

      <div className={styles.bookingForm}>
        <h2>Забронировать</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <div>
          <label>Дата заезда</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        <div>
          <label>Дата выезда</label>
          <input
            type="date"
            value={checkOut}
            min={getMinCheckOutDate()}
            onChange={(e) => setCheckOut(e.target.value)}
            disabled={!checkIn}
          />
        </div>
        <div>
          <label>Количество человек</label>
          <input type="number" min="1" value={numPeople} onChange={(e) => setNumPeople(parseInt(e.target.value))} />
        </div>
        <button onClick={handleBooking}>Забронировать</button>
      </div>
    </div>
  );
};

export default Room;
