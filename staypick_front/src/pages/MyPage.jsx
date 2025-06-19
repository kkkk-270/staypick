import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MySidebar from '../components/MySidebar';
import '../css/MyPage.css';

const MyPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="mypage-wrapper">
      <div className="mypage-container">
        <MySidebar />
        <div className="mypage-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
