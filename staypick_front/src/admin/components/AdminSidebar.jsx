import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import adminAxiosInstance from '../../api/adminAxiosInstance'; 
import '../css/AdminSidebar.css';

const AdminSidebar = ({ setAccId }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [accommodation, setAccommodation] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const res = await adminAxiosInstance.get("/admin/accommodation"); // ✅ 변경
        console.log("숙소 데이터 전체:", res.data);
        setAccommodation(res.data);
        console.log("받은 accId: ", res.data.accId);
        setAccId(res.data.accId);
      } catch (err) {
        console.error("Failed to load accommodation data: ", err.response ? err.response.data : err.message);
        if (err.response && err.response.status === 403) {
          alert("권한이 없습니다. 관리자 로그인 상태를 확인해주세요.");
        }
      }
    };
    fetchAccommodation();
  }, []);

  const formatDateTime = (date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric',
      weekday: 'short', hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    });
  };

  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-top">
        <div className="current-time">{formatDateTime(currentTime)}</div>
        <div className="accommodation-name">{accommodation ? accommodation.accName : '불러오는 중...'}</div>
      </div>

      <div className="admin-menu-section">
        <div className="menu-title">예약관리</div>
        <NavLink to="/admin/dashboard" className="admin-menu" activeclassname="active">예약달력</NavLink>
        <NavLink to="/admin/reservation" className="admin-menu" activeclassname="active">예약내역 보기</NavLink>
        <NavLink to="/admin/close-open" className="admin-menu" activeclassname="active">예약 닫기/열기</NavLink>
      </div>

      <div className="admin-menu-section">
        <div className="menu-title">숙소관리</div>
        <NavLink to="/admin/info" className="admin-menu" activeclassname="active">숙소 및 객실 정보 수정</NavLink>
        <NavLink to="/admin/season" className="admin-menu" activeclassname="active">성수기/주말 기간 관리</NavLink>
        <NavLink to="/admin/price" className="admin-menu" activeclassname="active">객실 기본요금 수정</NavLink>
        <NavLink to="/admin/discount" className="admin-menu" activeclassname="active">할인/판매 설정</NavLink>
      </div>

      <div className="admin-menu-section">
        <div className="menu-title">고객관리</div>
        <NavLink to="/admin/inquiries" className="admin-menu" activeclassname="active">문의 관리</NavLink>
        <NavLink to="/admin/reviews" className="admin-menu" activeclassname="active">리뷰 관리</NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
