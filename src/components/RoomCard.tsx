import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Styles.module.css';

interface RoomCardProps {
  room: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const hasImages = room.images && room.images.length > 0;

  return (
    <div className={styles.card}>
      <Link to={`/room/${room.id}`} className={styles.imageContainer}>
        {hasImages ? (
          <img src={room.images[currentImageIndex]} alt={room.name} className={styles.mainImage} />
        ) : (
          <div className={styles.noImage}>Нет фото</div>
        )}
      </Link>

      {hasImages && room.images.length > 1 && (
        <div className={styles.thumbnailContainer}>
          {room.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`thumbnail ${index + 1}`}
              className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
              onMouseEnter={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      )}

      <div className={styles.cardContent}>
        <h3>{room.name}</h3>
        <p>Цена: {room.price} руб.</p>
        <Link to={`/room/${room.id}`} className={styles.detailsLink}>Подробнее</Link>
      </div>
    </div>
  );
};

export default RoomCard;
