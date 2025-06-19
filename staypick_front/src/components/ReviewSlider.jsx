import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { RiStarFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../css/components/ReviewSlider.css';

const ReviewSlider = ({ hotelId }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get(`/api/reviews/accommodation/${hotelId}`);
        setReviews(res.data || []);
      } catch (err) {
        console.error(`리뷰 로딩 실패 - hotelId: ${hotelId}`, err);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [hotelId]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  if (reviews.length === 0) return null;

  return (
    <div className="review-slider-box">
      <div className="review-slider-header">
        <div className="review-slider-header-left">
          <RiStarFill className="review-slider-star filled" />
          {averageRating} ({reviews.length}) 숙소리뷰
        </div>
        <div className="review-slider-header-right">
          <button
            className="review-slider-seeall-btn"
            onClick={() => navigate(`/reviewdetail/${hotelId}`)}
          >
            전체보기 &gt;
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation]}
        spaceBetween={12}
        slidesPerView={2}
        navigation
        className="review-slider-swiper"
      >
        {reviews.slice(0, 6).map((review, index) => (
          <SwiperSlide key={index}>
            <div className="review-slider-card">
              <div className="review-slider-stars">
                {[...Array(5)].map((_, i) => (
                  <RiStarFill
                    key={i}
                    className={`review-slider-star ${i < review.rating ? 'filled' : ''}`}
                  />
                ))}
              </div>

              <div className="review-slider-date">
                {review.date || review.createdAt?.slice(0, 10)}
              </div>

              <div className="review-slider-text">{review.content}</div>

              {review.imageUrl && (
                <img
                  src={`http://localhost:8081/images/review-images/${review.imageUrl}`}
                  onError={(e) => {
                    if (!e.target.src.includes('default.jpg')) {
                      e.target.src = 'http://localhost:8081/images/review-images/default.jpg';
                    }
                  }}
                  alt="리뷰 이미지"
                  className="review-slider-image"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReviewSlider;
