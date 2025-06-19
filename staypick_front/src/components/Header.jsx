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
    const kakaoApiKey = import.meta.env.VITE_KAKAO_KEY;
    const logoutRedirectUri = window.location.origin;

    const kakaoLogoutUrl = `http://kauth.kakao.com/oauth/logout?client_id=${kakaoApiKey}&logout_redirect_uri=${logoutRedirectUri}`;
    const naverLogoutUrl = `${window.location.origin}/naver-logout-popup.html`;
    
    //user 정보 꺼내기
    const userData = JSON.parse(localStorage.getItem('user'));
    const isKakaoUser = userData?.userid?.startsWith('kakao_');
    const isNaverUser = userData?.userid?.startsWith('naver_');

    //로컬 로그아웃 처리
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ user: null, token: null }); // ✅ 컨텍스트 상태 초기화

    if(isKakaoUser){
      //카카오 로그아웃(자동 리디렉션됨)
      window.location.href = kakaoLogoutUrl;
      alert('로그아웃 되었습니다.');
    }else if(isNaverUser){
      //네이버 로그아웃 팝업 처리
      const popup = window.open(
        naverLogoutUrl,
        'naverLogout',
        'width=500,height=600,scrollbars=yes'
      );

      //팝업 차단감지
      if(!popup || popup.closed || typeof popup.closed === 'undefined'){
        alert('팝업이 차단되어 네이버 로그아웃을 진행할 수 없습니다.\n팝업 차단을 해제하거나 새 창에서 네이버 로그아웃을 시도해 주세요.');
        window.location.href = 'https://nid.naver.com/nidlogin.logout';
        return;
      }

      //팝업 닫힘 감지
      const timer = setInterval(() => {
        if(popup.closed) {
          clearInterval(timer);
          alert('네이버 로그아웃이 완료되었습니다.');
          window.location.href = logoutRedirectUri;
        }
      }, 500);
    }else{
      alert('로그아웃 되었습니다.');
      navigate('/');
    }
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
