import React, { useState } from 'react';
import '../css/components/ReviewImageModal.css';

const ReviewImageModal = ({ images = [], onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (images.length === 0) return null;

  return (
    <div className="review-modal">
  <button className="close-btn" onClick={onClose}>×</button>

  <div className="modal-image-wrapper">
    <button className="nav-btn nav-left" onClick={handlePrev}>&lt;</button>

    <img
      src={`http://localhost:8081${images[currentIndex]}`}
      alt={`리뷰 이미지 ${currentIndex + 1}`}
      className="modal-image"
    />

    <button className="nav-btn nav-right" onClick={handleNext}>&gt;</button>

    <p className="image-counter">
      {currentIndex + 1} / {images.length}
    </p>
  </div>
</div>
  );
};

export default ReviewImageModal;