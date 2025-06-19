import React, { useState,useEffect } from 'react';

const RoomImage = ({ src, alt }) => {
  const [error, setError] = useState(false);

  const baseUrl = "http://localhost:8081"
  const imageUrl = `${baseUrl}/upload/room-images/${src || 'room1.png'}`;
  const fallbackUrl = `${baseUrl}/upload/room-images/room1.png`;

   useEffect(() => {
    console.log("✅ 이미지 src 경로:", imageUrl);
  }, [imageUrl]);
  return (
    <img
      className="room-image"
      src={error ? fallbackUrl : imageUrl}
      alt={alt}
      onError={() => setError(true)}
      style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
    />
  );
};

export default RoomImage;
