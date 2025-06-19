import React from 'react';
import '../css/DashboardStats.css';

const DashboardStats = ({
  todayCheckIn = [],
  todayCheckOut = [],
  staying = [],
  monthReservations = []
}) => {
  console.log('DashboardStats 렌더링됨');
  
  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="stat-label">오늘 예약</div>
        <div className="stat-value">{todayCheckIn.length}건</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">체크아웃</div>
        <div className="stat-value">{todayCheckOut.length}건</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">현재 투숙</div>
        <div className="stat-value">{staying.length}명</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">이번 달 예약</div>
        <div className="stat-value">{monthReservations.length}건</div>
      </div>
    </div>
  );
};

export default DashboardStats;
