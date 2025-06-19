import React from 'react';
import {
  RiMapPinLine,
  RiHotelLine,
  RiMoneyDollarCircleLine,
  RiStarFill,
} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import '../css/components/HotelCard.css';

const HotelCard = ({ hotel, checkInDate, checkOutDate, guestCount }) => {
  const navigate = useNavigate();


  
  const handleClick = () => {
    if (!checkInDate || !checkOutDate || !guestCount) {
      alert('날짜와 인원 수를 모두 선택해주세요!');
      return;
    }

    navigate(`/detail/${hotel.id}`, {
      state: {
        checkInDate,
        checkOutDate,
        guestCount,
      },
    });
  };

  return (
    <div className="hotel-card">
      <div className="hotel-card-inner">
        <div className="hotel-card-image">
          <img
            src={`http://localhost:8081/upload/hotel-images/${hotel.thumbnail}`}
            onError={(e) => {
              e.target.src = 'http://localhost:8081/upload/hotel-images/default.png';
            }}
            alt={hotel.name}
          />
        </div>

        <div className="hotel-info">
          <div className="info-top">
            <h3 className="hotel-name">{hotel.name}</h3>
            <p className="hotel-location">
              <RiMapPinLine /> {hotel.address}
            </p>
            <p className="hotel-category">
              <RiHotelLine /> {hotel.type}
            </p>

            {/* ⭐ 리뷰 요약 표시 */}
            {hotel.reviewCount > 0 && (
              <p className="review-summary">
                <RiStarFill className="star-icon" />
                {hotel.averageRating?.toFixed(1)} ({hotel.reviewCount}건)
              </p>
            )}
          </div>

          <div className="info-bottom">
            <div className="hotel-price">
              <RiMoneyDollarCircleLine /> ₩{(hotel.price || 0).toLocaleString()} / 1박
            </div>
            <button className="reserve-btn" onClick={handleClick}>
              예약하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
