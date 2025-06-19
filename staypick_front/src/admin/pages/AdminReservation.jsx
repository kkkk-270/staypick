import React, { useEffect, useState } from 'react';
import adminAxiosInstance from '../../api/adminAxiosInstance';
import { useOutletContext } from 'react-router-dom';
import { TbReload } from 'react-icons/tb';
import ReservationDetailPanel from '../components/ReservationDetailPanel.jsx';
import '../css/AdminReservation.css';

const statusMapping = {
  confirmed: '예약확정',
  cancelled: '취소됨',
  checkedin: '체크인완료',
  past: '지난예약'
};

const statusReverseMapping = {
  전체: null,
  예약확정: 'confirmed',
  취소됨: 'cancelled',
  체크인완료: 'checkedin',
  지난예약: 'past'
};

const AdminReservation = () => {
  const { accId } = useOutletContext();
  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [searchRoom, setSearchRoom] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const reservationsPerPage = 12;

  useEffect(() => {
    if (!accId) return;

    const token = localStorage.getItem('adminToken');

    adminAxiosInstance.get(`/admin/reservation/${accId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => setReservations(res.data))
      .catch((err) => console.error('예약 데이터 로딩 실패: ', err))
      .finally(() => setIsLoading(false));
  }, [accId]);

  const handleUpdateReservations = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await adminAxiosInstance.post('/admin/reservation/update-past-status', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert(res.data);

      const refreshed = await adminAxiosInstance.get(`/admin/reservation/${accId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReservations(refreshed.data);
    } catch (err) {
      console.error('지난 예약상태 갱신 실패: ', err);
      alert('지난 예약 상태 갱신 실패');
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchKeyword =
      searchRoom === '' ||
      res.roomType?.includes(searchRoom) ||
      res.guestName?.includes(searchRoom);
    const matchStatus = filterStatus === '전체' ? res.status !== 'past' : res.status === statusReverseMapping[filterStatus];
    const checkIn = new Date(res.checkIn);
    const inRange =
      (!startDate || new Date(startDate) <= checkIn) &&
      (!endDate || new Date(endDate) >= checkIn);
    return matchKeyword && matchStatus && inRange;
  });

  const totalPages = Math.ceil(filteredReservations.length / reservationsPerPage);
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * reservationsPerPage,
    currentPage * reservationsPerPage
  );

  const handleCancelReservation = (id) => {
    setReservations(prev =>
      prev.map(res =>
        res.id === id ? { ...res, status: 'cancelled' } : res
      )
    );

    if (selectedReservation?.id === id) {
      setSelectedReservation(prev => ({
        ...prev,
        status: 'cancelled'
      }));
    }
  };

  const handleCheckInReservation = (id) => {
    setReservations((prev) =>
      prev.map((res) =>
        res.id === id ? { ...res, status: 'checkedin' } : res
      )
    );

    if (selectedReservation?.id === id) {
      setSelectedReservation((prev) => ({
        ...prev,
        status: 'checkedin',
      }));
    }
  };

  const getPaginationRange = () => {
    const range = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage <= 3) {
        range.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) range.push(i);
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) range.push(i);
      }
    }
    return range;
  };

  return (
    <div className="admin-page">
      <div className="reservation-wrapper">
        <div className="reservation-left">
          <div className="reservation-search-bar">
            <input
              type="text"
              placeholder="예약자, 객실명 검색"
              value={searchRoom}
              onChange={(e) => setSearchRoom(e.target.value)}
              onKeyDown={(e)=>{
                 if(e.key === ' ') e.preventDefault();
              }}
            />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button onClick={() => {}}>검색</button>
            <button
              onClick={handleUpdateReservations}
              title="지난 예약 상태 갱신"
              style={{ padding: '6px 10px' }}
            >
              <TbReload size={20} />
            </button>
          </div>

          <div className="reservation-status-filter">
            {['전체', '예약확정', '취소됨', '체크인완료', '지난예약'].map(status => (
              <button
                key={status}
                className={filterStatus === status ? 'active' : ''}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
          {isLoading ? (
             <div className="loading-spinner">
                <div className="spinner"></div>
                <div>로딩 중입니다...</div>
              </div>
          ):(
          <table className="reservation-table">
            <thead>
              <tr>
                <th>예약자</th>
                <th>객실명</th>
                <th>체크인</th>
                <th>체크아웃</th>
                <th>인원</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedReservations.map((res, idx) => (
                <tr key={idx} onClick={() => setSelectedReservation(res)} className='reservation-table-bar'>
                  <td>{res.guestName}</td>
                  <td>{res.roomName} ({res.roomNumber}호)</td>
                  <td>{res.checkIn} {res.roomCheckIn}</td>
                  <td>{res.checkOut} {res.roomCheckOut}</td>
                  <td>{res.personnel}명</td>
                  <td><span className={`status ${res.status}`}>{statusMapping[res.status] || res.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          )}

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>

            {getPaginationRange().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? 'active' : ''}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>

        <div className="reservation-right">
          <ReservationDetailPanel
            reservation={selectedReservation}
            onCancel={handleCancelReservation}
            onCheckIn={handleCheckInReservation}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminReservation;