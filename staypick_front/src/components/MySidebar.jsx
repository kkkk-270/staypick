import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/MyPage.css';

const MySidebar = () => {
  return (
    <div className="mypage-sidebar">
      <ul>
        <li>
          <NavLink
            to="info"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            내 정보
          </NavLink>
        </li>
        <li>
          <NavLink
            to="reservations"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            예약 내역
          </NavLink>
        </li>
        <li>
          <NavLink
            to="reviews"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            내 리뷰
          </NavLink>
        </li>
        <li>
          <NavLink
            to="inquiry"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            내 문의
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MySidebar;
