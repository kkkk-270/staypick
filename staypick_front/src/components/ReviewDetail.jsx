import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RiArrowLeftLine, RiStarFill } from 'react-icons/ri';
import '../css/components/ReviewDetail.css';
import axiosInstance from '../api/axiosInstance';
import ReviewImageModal from './ReviewImageModal';

const ReviewDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);

  useEffect(() => {
    axiosInstance.get(`/reviews/accommodation/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error('리뷰 불러오기 실패', err));
  }, [id]);

  const openModal = (images) => {
    setModalImages(images);
    setIsModalOpen(true);
  };

  return (
    <div className="review-detail-container">
      <main className="review-detail-main">
        <div className="review-detail-top">
          <h1 className="review-detail-title">리뷰 전체보기</h1>
          <div className="review-detail-meta">총 <strong>{reviews.length}</strong>개</div>
        </div>

        <div className="review-detail-list">
          {reviews.map((review, idx) => (
            <div className="review-detail-box" key={idx}>
              <div className="review-detail-stars">
                {[...Array(review.rating)].map((_, i) => (
                  <RiStarFill key={i} className="review-detail-star-icon" />
                ))}
              </div>
              <div className="review-detail-date">{review.createdAt?.slice(0, 10)}</div>
              <div className="review-detail-text">{review.content}</div>

              {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="review-image-group" onClick={() => openModal(review.imageUrls)}>
                  <img
                    src={`http://localhost:8081${review.imageUrls[0]}`}
                    alt="리뷰 이미지"
                    className="main-review-image"
                  />
                  {review.imageUrls.length > 1 && (
                    <div className="sub-review-image-wrapper">
                      <img
                        src={`http://localhost:8081${review.imageUrls[1]}`}
                        alt="추가 이미지"
                        className="sub-review-image"
                      />
                      <div className="overlay">+{review.imageUrls.length - 1}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="review-detail-back-link" onClick={() => navigate(-1)}>
          <RiArrowLeftLine className="review-detail-arrow-icon" /> 돌아가기
        </button>
      </main>

      {isModalOpen && (
        <ReviewImageModal
          images={modalImages}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ReviewDetail;