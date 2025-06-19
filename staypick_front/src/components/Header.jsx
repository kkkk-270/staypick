import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // ✅ AuthContext 임포트
import '../css/components/Header.css';

const Header = () => {
  const { auth, setAuth } = useAuth(); // ✅ 로그인 상태 및 업데이트 함수 가져오기
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = !!auth.token; // ✅ 로그인 여부 판단

  const handleLogout = () => {
    localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 제거
    setAuth({ user: null, token: null }); // ✅ 컨텍스트 상태 초기화
    alert('로그아웃 되었습니다.');
    navigate('/'); // 홈으로 이동
  };

  return (
    <header className="main-header">
      <div className="header-inner">
        <div className="left">
          <img
            src="/imgs/home-images/logo.png"
            alt="STAYPICK"
            className="header-logo"
            onClick={() => navigate('/')} // 로고 클릭 시 홈으로 이동
          />
        </div>
        <nav className="center">
          <a href="/HotelList">숙박예약</a>
          <a href="/board">게시판</a>
          <a href="/mypage">마이페이지</a>
        </nav>
        <div className="right">
          {isLoggedIn ? (
            <>
              <span>{decodeURIComponent(escape(auth.user?.username))} 님</span>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              {location.pathname !== '/login' && (
                <button onClick={() => navigate('/login')}>로그인</button>
              )}

              {location.pathname !== '/register' && (
                <button onClick={() => navigate('/register')}>회원가입</button>
              )}
              
              <button onClick={() => navigate('/admin/login')} className="admin-login">
                사장님 로그인
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
