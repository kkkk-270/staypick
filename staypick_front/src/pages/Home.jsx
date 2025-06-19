import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/home.css';
// import mainBanner from '../assets/images/main-banner.png'; ❌ 제거

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <div className="home-container">
        <div className="home-left">
          <h1>국내 게스트하우스부터 호텔까지<br />모든 숙소를 쉽고 간편하게 한 번에</h1>
          <p className="subtitle1">국내여행을 떠나실 건가요?</p>
          <p className="subtitle2">
            여행지 근처 숙소를 종류별로 모두 예약 가능한
            <br />
            STAYPICK입니다.
          </p>
          <button
            className="main-btn"
            onClick={() => navigate('/HotelList')}
          >
            숙박 예약하기
          </button>
        </div>
        <div className="home-right">
          <img src="/imgs/home-images/main-banner.png" alt="Main Visual" />
        </div>
      </div>
    </div>
  );
};

export default Home;
