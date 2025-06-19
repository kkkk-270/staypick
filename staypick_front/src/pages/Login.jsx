import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../css/Login.css';
import naverIcon from '../assets/images/naver.png';
import { RiKakaoTalkFill } from "react-icons/ri";
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import KakaoLogin from 'react-kakao-login';

const Login = () => {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuth();

  const kakaoApiKey = import.meta.env.VITE_KAKAO_KEY;
  const naverClientId = import.meta.env.VITE_NAVER_CLIENT_ID;
  const naverCallbackUrl = import.meta.env.VITE_NAVER_REDIRECT_URI;

  // 기본 로그인
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/auth/login', {
        userid,
        password
      });

      if (response.status === 200) {
        let token = response.data.token || response.data;
        if (!token) {
          alert("로그인 토큰이 존재하지 않습니다.");
          return;
        }

        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          userid: payload.sub,
          username: payload.username,
          role: payload.role
        };
        localStorage.setItem('user', JSON.stringify(user));
        setAuth({ user, token });
        navigate('/');
      } else {
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      console.error('로그인 오류:', err);
      alert('로그인 실패');
    }
  };

  // ✅ 카카오 로그인
  const kakaoResponse = async (response) => {
    const { access_token } = response.response;
    try {
      const res = await axios.post('http://localhost:8081/api/auth/kakao-login', {
        accessToken: access_token
      });

      if (res.data.token) {
        const token = res.data.token;
        localStorage.setItem('token', token);
        const payload = JSON.parse(atob(token.split('.')[1]));
        const user = {
          userid: payload.sub,
          username: payload.username,
          role: payload.role
        };
        setAuth({ user, token });
        navigate('/');
      } else if (res.data.needAdditionalInfo) {
        navigate('/register', {
          state: {
            userid: res.data.userid,
            username: res.data.username,
            isKakaoUser: true
          }
        });
      } else {
        alert("응답 형식이 예상과 다릅니다.");
      }
    } catch (err) {
      console.error('카카오 로그인 실패', err);
      alert('카카오 로그인 실패');
    }
  };

  // ✅ 네이버 로그인 (Authorization Code Flow)
  const handleNaverLogin = () => {
    const state = Math.random().toString(36).substring(2, 15);
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naverClientId}&redirect_uri=${encodeURIComponent(naverCallbackUrl)}&state=${state}`;
    window.location.href = naverAuthUrl;
  };

  const handleNaverRedirect = async () => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (code && state) {
      try {
        const res = await axios.post(
          'http://localhost:8081/api/auth/naver-login', 
          { code, state },
          {
            headers: {
              Authorization: ''
            }
          }
        );

        if (res.data.token) {
          const token = res.data.token;
          localStorage.setItem('token', token);
          const payload = JSON.parse(atob(token.split('.')[1]));
          const user = {
            userid: payload.sub,
            username: payload.username,
            role: payload.role
          };
          setAuth({ user, token });
          navigate('/');
        } else if (res.data.needAdditionalInfo) {
          navigate('/register', {
            state: {
              userid: res.data.userid,
              username: res.data.username,
              email: res.data.email,
              isNaverUser: true
            }
          });
        } else {
          alert("응답 형식이 예상과 다릅니다.");
        }
      } catch (err) {
        console.error('네이버 로그인 실패', err);
        alert('네이버 로그인 실패');
      }
    }
  };

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoApiKey);
    }
    handleNaverRedirect();
  }, []);

  return (
    <div className="loginPage">
      <h1>로그인</h1>
      <p>아이디와 비밀번호를 입력하세요.</p>
      
      <input
        type="text"
        placeholder="아이디"
        value={userid}
        onChange={(e) => setUserid(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === 'Enter'){
            handleLogin();
          }
          if(e.key === ' ') e.preventDefault();
        }}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === 'Enter'){
            handleLogin();
          }
          if(e.key === ' ') e.preventDefault();
        }}
      />
      <button className="login-btn" onClick={handleLogin}>로그인</button>

      <div className="signUp-info">
        <a href="#" className="signUp-btn" onClick={() => navigate('/register')}>계정 생성</a>
        <span className="signUp-btn">|</span>
        <a href="#" className="signUp-btn" onClick={() => navigate('/findaccount')}>아이디 / 비밀번호 찾기</a>
      </div>

      <div className="social">
        <KakaoLogin
          token={kakaoApiKey}
          onSuccess={kakaoResponse}
          onFailure={kakaoResponse}
          scope="account_email,profile_nickname,profile_image"
          render={({ onClick }) => (
            <button onClick={onClick} className='kakao-btn'>
              <RiKakaoTalkFill className='kakao-icon' /> 카카오로 로그인하기
            </button>
          )}
        />
        <button className="naver-btn" onClick={handleNaverLogin}>
          <img src={naverIcon} alt="naver-icon" />네이버로 로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
