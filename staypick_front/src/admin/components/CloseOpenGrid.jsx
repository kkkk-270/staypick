import React from 'react';
import '../css/CloseOpenGrid.css';
import adminAxiosInstance from '../../api/adminAxiosInstance';

const CloseOpenGrid = ({ roomData, closedDates, setClosedDates, startDate, endDate, weeklyStatus, setWeeklyStatus, reservations }) => {

  const getDateRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const until = new Date(end);
    while (current <= until) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };
  const dateList = getDateRange(startDate, endDate);

  const getCellStatus = (roomId, date) => {

    const roomWeeklyStatus = weeklyStatus?.[roomId];

    if(roomWeeklyStatus?.[date] === "운영중단") return '운영중단';

    // 운영중단 상태가 우선
    const isClosed = closedDates.find(c => c.room === roomId && c.date === date);
    if (isClosed) return '운영중단';

    return roomWeeklyStatus?.[date]; // '예약 가능' | '예약됨' | '체크인 완료'
  };

  const updateRoomStatus = async (roomId, date, status) => {
    try{
      const response = await adminAxiosInstance.post('/admin/room-status/update', {
        roomId,
        date,
        status
      });
      console.log("상태 업데이트 완료");
    }catch(error){
      console.error("객실 상태 업데이트 실패: ", error);
    }
  }

  const toggleClose = async (roomId, date) => {
    const status = getCellStatus(roomId, date);
    if (status === '예약됨' || status === '체크인 완료') return;

    if (status === '운영중단') {
      setClosedDates(closedDates.filter(c => !(c.room === roomId && c.date === date)));
      await updateRoomStatus(roomId, date, '운영중');

      setWeeklyStatus(prev => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [date]: '운영중'
        }
      }));
    } else {
      setClosedDates([...closedDates, { room: roomId, date }]);
      await updateRoomStatus(roomId, date, '운영중단');

      setWeeklyStatus(prev => ({
        ...prev,
        [roomId]: {
          ...prev[roomId],
          [date]: '운영중단'
        }
      }));
    }
  };

  const getDisplayText = (status) => {
    switch (status) {
      case '예약 가능':
        return '운영중';
      case '운영중단':
        return '운영중단';
      case '예약됨':
        return '예약됨';
      case '체크인 완료':
        return '체크인';
      case '취소됨':
        return '운영중';
      default:
        return status;
    }
  };

  return (
    <div className="grid-wrapper">
      <table className="closeopen-grid">
        <thead>
          <tr>
            <th>객실번호</th>
            {dateList.map(date => (
              <th key={date}>{new Date(date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit', weekday: 'short' })}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roomData.map(room => (
            <tr key={`room-${room.id}`}>
              <td className="room-name">{room.roomNumber}호</td>
              {dateList.map(date => {
                const status = getCellStatus(room.id, date);

                const roomReservations = reservations && reservations[room.id] || [];
                const reservationOnDate = roomReservations.find(res => {
                  const resCheckIn = new Date(res.checkIn);
                  const resCheckOut = new Date(res.checkOut);
                  const cellDateObj = new Date(date);

                  return cellDateObj >= resCheckIn && cellDateObj < resCheckOut;
                });

                const titleText = reservationOnDate ?
                  `${reservationOnDate.guestName || '알 수 없음'} (${reservationOnDate.statusKor})` : '';
                return (
                  <td
                    key={`${room.id}-${date}`}
                    className={`cell ${status ? status.replace(/\s/g, '-').toLowerCase() : '예약-가능'}`}
                    onClick={() => toggleClose(room.id, date)}
                    title={titleText}
                  >
                    {getDisplayText(status)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CloseOpenGrid;
