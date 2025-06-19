import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import '../css/components/MyReviews.css';
import { FaStar } from 'react-icons/fa';
import ReviewImageModal from './ReviewImageModal';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [modalImages, setModalImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (isoString) => {
    if (!isoString) return '-';
    return isoString.split('T')[0].replace(/-/g, '.');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData) return;

    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get('/reviews/mine', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setReviews(res.data);
      } catch (err) {
        console.error('❌ 리뷰 불러오기 실패:', err);
      }
    };

    fetchReviews();
  }, []);

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const handleDelete = async (reviewId) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) return;

    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      alert('리뷰가 삭제되었습니다.');
    } catch (err) {
      console.error('❌ 리뷰 삭제 실패:', err);
      alert('리뷰 삭제 중 오류가 발생했습니다.');
    }
  };

  const openModal = (images) => {
    setModalImages(images);
    setIsModalOpen(true);
  };

  if (!user) return <div className="review-container">⚠️ 로그인이 필요합니다.</div>;

  return (
    <div className="review-container">
      <h2 className="review-title">내가 작성한 리뷰</h2>
      {reviews.length === 0 ? (
        <p>작성한 리뷰가 없습니다.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <div>
                <h3 className="hotel-name">{review.accommodationName || '숙소명 없음'}</h3>
                <p className="hotel-sub">{review.roomName || '객실명 없음'}</p>
                <p className="hotel-dates">
                  체크인: {formatDate(review.checkIn)} / 체크아웃: {formatDate(review.checkOut)}
                </p>
              </div>
              <div className="review-meta">
                <p className="review-date">{formatDate(review.createdAt)}</p>
                <button className="delete-btn" onClick={() => handleDelete(review.id)}>삭제</button>
              </div>
            </div>

            <div className="star-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className="star-icon"
                  color={i < review.rating ? '#f39c12' : '#e0e0e0'}
                />
              ))}
            </div>

            <p className="review-content">{review.content || '(내용 없음)'}</p>

            {review.imageUrls?.length > 0 && (
              <div className="review-image-group" onClick={() => openModal(review.imageUrls)}>
                <img
                  src={`http://localhost:8081${review.imageUrls[0]}`}
                  alt="대표 이미지"
                  className="main-review-image"
                />
                {review.imageUrls.length > 1 && (
                  <div className="sub-review-image-wrapper">
                    <img
                      src={`http://localhost:8081${review.imageUrls[1]}`}
                      alt="서브 이미지"
                      className="sub-review-image"
                    />
                    <div className="overlay">+{review.imageUrls.length - 1}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}

      {isModalOpen && (
        <ReviewImageModal
          images={modalImages}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MyReviews;