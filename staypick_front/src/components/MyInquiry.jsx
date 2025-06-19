// MyInquiries.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import '../css/components/MyInquiries.css';

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/inquiries');
        setInquiries(res.data);
      } catch (err) {
        console.error('❌ 문의 목록 불러오기 실패:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="inquiry-container">
      <h2 className="inquiry-title">내가 작성한 문의</h2>
      {inquiries.map((inquiry) => (
        <div key={inquiry.id} className="inquiry-card">
          <div className="inquiry-box">
            <div className="inquiry-box-row">
              <span className="inquiry-box-label">문의 종류:</span>
              <span>{inquiry.inquiryType}</span>
            </div>
            <div className="inquiry-box-row">
              <span className="inquiry-box-label">문의 제목:</span>
              <span>{inquiry.title}</span>
            </div>
            <div className="inquiry-box-row">
              <span className="inquiry-box-label">문의 내용:</span>
              <div className="inquiry-content-box">{inquiry.content}</div>
            </div>
            <div className="inquiry-box-row">
              <span className="inquiry-box-label">문의 날짜:</span>
              <span>{new Date(inquiry.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="inquiry-box-row">
              <span className="inquiry-box-label">문의 상태:</span>
              <span className={`status ${inquiry.comment ? 'status-complete' : 'status-pending'}`}>
                {inquiry.comment ? '답변 완료' : '처리 중'}
              </span>
            </div>
            {inquiry.comment && (
              <div className="inquiry-box-row">
                <span className="inquiry-box-label">문의 답변:</span>
                <div className="inquiry-comment-box">{inquiry.comment}</div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyInquiries;
