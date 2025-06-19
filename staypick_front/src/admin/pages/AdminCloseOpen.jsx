import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/AdminCloseOpen.css';
import CloseOpenGrid from '../components/CloseOpenGrid';
import adminAxiosInstance from '../../api/adminAxiosInstance';
import { useOutletContext } from 'react-router-dom';

const getFormattedDate = (date) => date.toISOString().split('T')[0];

const getWeekRange = (base) => {
  const monday = new Date(base);
  monday.setDate(monday.getDate() - monday.getDay() + 1);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return {
    start: getFormattedDate(monday),
    end: getFormattedDate(sunday),
  };
};

const mapStatus = (status) => {
  switch (status) {
    case 'confirmed':
      return '예약됨';
    case 'checkedin':
      return '체크인 완료';
    case 'cancelled':
      return '취소됨';
    default:
      return '예약 가능';
  }
};

const toDateOnly = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const AdminCloseOpen = () => {
  const { accId } = useOutletContext();
  const [baseDate, setBaseDate] = useState(new Date());
  const [openRooms, setOpenRooms] = useState({});
  const [closedDates, setClosedDates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [roomSearch, setRoomSearch] = useState('');
  const [reservations, setReservations] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [weeklyStatus, setWeeklyStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(!accId) {
      setIsLoading(false);
      return;
    }
    const token = localStorage.getItem('adminToken');

    const fetchReservation = adminAxiosInstance.get(`/admin/reservation/${accId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const fetchRooms = adminAxiosInstance.get(`/admin/room/list?accId=${accId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    Promise.all([fetchReservation, fetchRooms])
      .then(([resReservations, resRooms]) => {
        setReservations(resReservations.data);
        setAllRooms(resRooms.data);
        setIsLoading(false);

        const initialOpenRooms = {};
        resRooms.data.forEach(room => {
          initialOpenRooms[room.roomName] = true;
        });
        setOpenRooms(initialOpenRooms);
      })
      .catch((err) => {
        console.error('모든 객실 데이터 로딩 실패: ', err);
        setIsLoading(false);
      });
  }, [accId]);

  useEffect(() => {
    if(!accId) return;

    const {start, end} = getWeekRange(baseDate);
    const token = localStorage.getItem('adminToken');

    adminAxiosInstance.get('/admin/weekly-status', {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {start, end}
    })
    .then(res => {
      setWeeklyStatus(res.data);
    })
    .catch(err => {
      console.error('주간 객실 상태 불러오기 실패: ', err);
    });
  }, [baseDate, accId]);

  const { start, end } = getWeekRange(baseDate);
  
  // 필터용 카테고리(객실 타입) 목록 생성
  const roomNameAsCategories = ['전체', ...new Set(allRooms.map(entry => entry.roomName))];

  // 객실별로 예약 데이터를 그룹화
  const groupedByRoom = {};
  allRooms.forEach(room => {

    const inCategory = selectedCategory === '전체' || room.roomName === selectedCategory;
    const inSearch = roomSearch === '' || room.roomName.includes(roomSearch) || String(room.roomNumber).includes(roomSearch);

    if(!groupedByRoom[room.roomName]){
      groupedByRoom[room.roomName] = {
        roomName: room.roomName,
        rooms: [],
        reservations: {},
        weeklyStatus: {}
      };
    }

    if(inCategory && inSearch){
      groupedByRoom[room.roomName].rooms.push(room);
    }

    groupedByRoom[room.roomName].weeklyStatus[room.id] = weeklyStatus[room.id] || {};

    const dateRange = getWeekRange(baseDate);
    let startDateObj = new Date(dateRange.start);
    const endDateObj = new Date(dateRange.end);

    const roomReservationsInWeek = reservations.filter((r) => {
      if (r.roomId !== room.id) return false;
      const resCheckIn = toDateOnly(r.checkIn);
      const resCheckOut = toDateOnly(r.checkOut);
      // 체크인 날짜 < 주 종료일 AND 체크아웃 날짜 > 주 시작일
      return resCheckIn < endDateObj && resCheckOut > startDateObj;
    });

    const individualRoomWeeklyStatus = {};
    for (
      let currentDate = new Date(startDateObj);
      currentDate <= endDateObj;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const formattedDate = getFormattedDate(currentDate);
      
      const statusFromWeekly = weeklyStatus[room.id]?.[formattedDate];
      
      const overlappingReservation = roomReservationsInWeek.find((res) => {
        const resCheckIn = toDateOnly(res.checkIn);
        const resCheckOut = toDateOnly(res.checkOut);
        return currentDate >= resCheckIn && currentDate < resCheckOut;
      });

      if(statusFromWeekly === '운영중단'){
        individualRoomWeeklyStatus[formattedDate] = '운영중단';
      }else if(overlappingReservation) {
        individualRoomWeeklyStatus[formattedDate] = mapStatus(overlappingReservation.status);
      }else{
        individualRoomWeeklyStatus[formattedDate] = '예약 가능'
      }
    }
    groupedByRoom[room.roomName].weeklyStatus[room.id]= individualRoomWeeklyStatus;
    groupedByRoom[room.roomName].reservations[room.id] = roomReservationsInWeek.map(res => ({
      ...res,
      statusKor: mapStatus(res.status)
    }));
  });

  const toggleRoom = (roomName) => {
    setOpenRooms((prev) => ({
      ...prev,
      [roomName]: !prev[roomName],
    }));
  };

  return (
    <div className="closeopen-page">
      <div className="panel-box">
        <div className="panel-header">
          <div className="panel-title">객실 상태 관리</div>
          <div className="panel-meta">{start} ~ {end}</div>
        </div>

        <div className="panel-filterbar">
          <div className="panel-controls">
            <button onClick={() => setBaseDate(prev => {
              const d = new Date(prev);
              d.setDate(d.getDate() - 7);
              return d;
            })}>← 지난주</button>
            <button onClick={() => setBaseDate(new Date())}>이번 주</button>
            <button onClick={() => setBaseDate(prev => {
              const d = new Date(prev);
              d.setDate(d.getDate() + 7);
              return d;
            })}>다음주 →</button>
            <DatePicker
              selected={baseDate}
              onChange={setBaseDate}
              dateFormat="yyyy-MM-dd"
              className="calendar-input"
            />
          </div>

          <div className="category-tabs">
            {roomNameAsCategories.map((name) => (
              <button
                key={name}
                className={`category-btn ${selectedCategory === name ? 'active' : ''}`}
                onClick={() => setSelectedCategory(name)}
                type="button"
              >
                {name}
              </button>
            ))}
            <input
              type="text"
              placeholder="객실명 또는 객실번호 검색 (예: 스탠다드, 101호)"
              className="room-search-input"
              value={roomSearch}
              onChange={(e) => setRoomSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="reservation-grid">
        {isLoading ? (
            <p className="loading-message">객실 정보를 불러오는 중입니다...</p>
        ) : (
            Object.entries(groupedByRoom).length > 0 ? ( // ⭐ 데이터가 있을 때만 렌더링
                Object.entries(groupedByRoom).map(([roomName, roomData]) => (
                    <div key={roomName} className="room-section">
                        <div className="room-header">
                            <button
                                type="button"
                                className="room-toggle-btn"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleRoom(roomName);
                                }}
                            >
                                <strong>{roomName}</strong>
                                <span>{openRooms[roomName] ? '접기 ▲' : '펼치기 ▼'}</span>
                            </button>
                        </div>
                        {openRooms[roomName] && (
                            <CloseOpenGrid
                                roomData={roomData.rooms}
                                startDate={start}
                                endDate={end}
                                closedDates={closedDates}
                                setClosedDates={setClosedDates}
                                weeklyStatus={roomData.weeklyStatus}
                                setWeeklyStatus={setWeeklyStatus}
                                reservations={roomData.reservations}
                            />
                        )}
                    </div>
                ))
            ) : (
                <p className="no-rooms-message">표시할 객실이 없습니다.</p> // ⭐ 필터링 후 객실이 없을 때 메시지
            )
        )}
      </div>
    </div>
  );
};

export default AdminCloseOpen;