import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import '../css/components/ReviewWrite.css';

const ReviewWrite = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("🔐 예약조회 요청:", reservationId, token);

        const res = await axiosInstance.get(`/reservations/${reservationId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("✅ 예약 데이터 응답:", res.data);
        setReservation(res.data);
      } catch (err) {
        console.error('❌ 예약 정보 로딩 실패:', err);
      }
    };
    fetchReservation();
  }, [reservationId]);

  // 렌더링 중 상태 확인
  console.log("📦 현재 reservation 상태:", reservation);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !content.trim()) {
      alert('별점과 리뷰 내용을 모두 입력해주세요.');
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    const reviewData = {
      reservationId: Number(reservationId),
      rating,
      content,
    };

    formData.append('data', new Blob([JSON.stringify(reviewData)], { type: 'application/json' }));
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      await axiosInstance.post('/reviews', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('✅ 리뷰가 등록되었습니다.');
      navigate('/mypage/reviews');
    } catch (error) {
      console.error('❌ 리뷰 등록 실패:', error);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  if (!reservation) return <div className="review-write-page">로딩 중...</div>;

  return (
    <div className="review-write-page">
      <h2>리뷰 작성</h2>
      <div className="reservation-info-box">
        <h3>{reservation?.accommodationName || '숙소명 없음'}</h3>
        <p>객실명: {reservation?.roomName || '-'}</p>
        <p>
          체크인: {reservation?.checkIn || '-'} / 체크아웃: {reservation?.checkOut || '-'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <label>
          별점:
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((value) => (
              <FaStar
                key={value}
                className={`star ${value <= rating ? 'active' : ''}`}
                onClick={() => setRating(value)}
              />
            ))}
          </div>
        </label>

        <label>
          리뷰 내용:
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="숙소 이용 후기를 작성해주세요"
          />
        </label>

        <div className="image-upload-wrapper">
          <label htmlFor="file-upload" className="custom-file-label">사진 첨부</label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <span className="file-count">
            {selectedFiles.length > 0 ? `파일 ${selectedFiles.length}개` : '파일 없음'}
          </span>
        </div>

        {previewUrls.length > 0 && (
          <div className="image-preview-container">
            {previewUrls.map((url, index) => (
              <div key={index} className="image-preview-box">
                <img src={url} alt={`preview-${index}`} className="preview-img" />
                <button
                  type="button"
                  className="remove-img-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit">등록하기</button>
      </form>
    </div>
  );
};

export default ReviewWrite;
