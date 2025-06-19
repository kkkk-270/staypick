import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'
import moment from 'moment';
import ReservationCalendar from '../components/ReservationCalendar';
import ReservationList from '../components/ReservationList';
import DashboardStats from '../components/DashboardStats';
import ReviewPreview from '../components/ReviewPreview';
import QuickMenu from '../components/QuickMenu';
import adminAxiosInstance from '../../api/adminAxiosInstance';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const {accId} = useOutletContext();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if(!token) {
      alert('로그인이 필요합니다.');
      navigate('/admin/login');
      return;
    }

    try{
      const decoded = jwtDecode(token);
      if(decoded.role !== 'ADMIN'){
        alert('관리자만 접근 가능한 페이지입니다.');
        navigate('/');
      }
    }catch(error){
      console.error('토큰 디코딩 실패: ', error);
      alert('유효하지 않은 토큰입니다.');
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if(!accId) return;

    const token = localStorage.getItem('adminToken');

    adminAxiosInstance.get(`/admin/reservation/${accId}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setReservations(res.data);
    })
    .catch(err => {
      console.error('예약 데이터 로딩 실패: ', err);
    });
  }, [accId]);


  const today = moment().format('YYYY-MM-DD');
  const selectedMonth = moment(selectedDate).format('YYYY-MM');

  const todayCheckIn = reservations.filter(res =>
    moment(res.checkIn).format('YYYY-MM-DD') === today
  );

  const todayCheckOut = reservations.filter(res =>
    moment(res.checkOut).format('YYYY-MM-DD') === today
  );

  const staying = reservations.filter(res => {
    const checkIn = moment(res.checkIn);
    const checkOut = moment(res.checkOut);
    return moment(today).isBetween(checkIn, checkOut, null, '[)');
  });

  const monthReservations = reservations.filter(res =>
    moment(res.checkIn).format('YYYY-MM') === selectedMonth
  );

  return (
    <div className="admin-dashboard">
  
      <div className="admin-body">
  

        <main className="main-panel">
          <div className="dashboard-grid">
            <div className="left-column">
              <div className="box calendar-box">
                <ReservationCalendar
                  reservations={reservations}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              </div>

              <div className="box stats-box">
                <DashboardStats
                  todayCheckIn={todayCheckIn}
                  todayCheckOut={todayCheckOut}
                  staying={staying}
                  monthReservations={monthReservations}
                />
              </div>

              <div className="box quickmenu-box">
                <QuickMenu />
              </div>
            </div>

            <div className="right-column">
              <div className="box list-box">
                <ReservationList
                  reservations={reservations}
                  selectedDate={selectedDate}
                  onSelectReservation={() => {}}
                />
              </div>

              <div className="box review-box">
                <ReviewPreview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
