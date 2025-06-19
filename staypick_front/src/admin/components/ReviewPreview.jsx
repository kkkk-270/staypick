import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminAxiosInstance from '../../api/adminAxiosInstance';
import '../css/ReviewPreview.css';

const ReviewPreview = () => {
  const [summary, setSummary] = useState(null);
  const navigate = useNavigate();

  const isSameDate = (d1, d2) => (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );

  useEffect(() => {
    adminAxiosInstance.get('/api/admin/reviews')
      .then((res) =>{
        const reviews = res.data;

        const today = new Date();
        
        const todayReviewCount = reviews.filter(r => {
          if (!r.createdAt) return false;
          const created = new Date(r.createdAt);
          return isSameDate(created, today);
        }).length;

        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 6);

        const weekReviewCount = reviews.filter(r => {
          if (!r.createdAt) return false;
          const created = new Date(r.createdAt);
          return created >= last7Days && created <= today;
        }).length;

        const ratings = reviews.map(r => r.rating).filter(r => typeof r === 'number');
        const averageRating = ratings.length > 0
          ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
          : 0;
        
        const lowRatingCount = ratings.filter(r => r <= 4).length;

        setSummary({
          todayReviewCount,
          weekReviewCount,
          averageRating,
          lowRatingCount
        });
      })
      .catch((err) => console.error('리뷰 요약 로딩 실패:', err));
  }, []);

  return (
    <div className="review-summary-card">
      <div className="review-summary-header">
        <h3>최근 리뷰 요약</h3>
        <button onClick={() => navigate('/admin/reviews')}>전체 리뷰 보기</button>
      </div>
      {summary ? (
        <div className="review-summary-body">
          <div className="summary-row">
            <span className="label">오늘 등록된 리뷰</span>
            <span className="value">{summary.todayReviewCount}건</span>
          </div>
          <div className="summary-row">
            <span className="label">최근 7일 리뷰 수</span>
            <span className="value">{summary.weekReviewCount}건</span>
          </div>
          <div className="summary-row">
            <span className="label">평균 평점</span>
            <span className={`value ${summary.averageRating < 4 ? 'low' : ''}`}>
              {summary.averageRating}점
            </span>
          </div>
          <div className="summary-row">
            <span className="label">4점 이하 리뷰</span>
            <span className="value alert">{summary.lowRatingCount}건</span>
          </div>
        </div>
      ) : (
        <p className="loading">리뷰 데이터를 불러오는 중입니다.</p>
      )}
    </div>
  );
};

export default ReviewPreview;
