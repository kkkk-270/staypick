import React from 'react';
import '../css/ReservationList.css';

const ReservationList = ({ reservations, selectedDate, onSelectReservation }) => {
  const selectedDateStr = selectedDate.toISOString().split('T')[0];

  const filteredReservations = reservations.filter(res => {
    const sel = new Date(selectedDate.toDateString());
    const inDate = new Date(new Date(res.checkIn).toDateString());
    const outDate = new Date(new Date(res.checkOut).toDateString());

    if (inDate.getTime() === outDate.getTime()){
      return sel.getTime === inDate.getTime;
    }
    return sel.getTime() >= inDate.getTime() && sel.getTime() <= outDate.getTime();
  });

  return (
    <div className="reservation-summary-box">
      <h3>{selectedDate.toLocaleDateString('ko-KR')} 예약 리스트</h3>
      <div className="reservation-list-scroll">
        {filteredReservations.length > 0 ? (
          filteredReservations.map((res, index) => (
            <div
              key={index}
              className="reservation-entry"
              onClick={() => onSelectReservation(res)}
            >
              <span className="room-badge">{res.roomName}</span>
              <div>
                체크인: {res.checkIn}<br />
                체크아웃: {res.checkOut}<br />
                {res.guestName}님
              </div>
            </div>
          ))
        ) : (
          <p className="no-reservations">예약 없음</p>
        )}
      </div>
    </div>
  );
};

export default ReservationList;