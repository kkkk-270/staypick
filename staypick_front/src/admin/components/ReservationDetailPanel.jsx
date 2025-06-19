import React, { useState, useEffect } from 'react';
import adminAxiosInstance from '../../api/adminAxiosInstance'; // ✅ 관리자 전용
import '../css/ReservationDetailPanel.css';

const statusMap = {
  confirmed: '예약확정',
  cancelled: '취소됨',
  checkedin: '체크인완료',
};

const paymentMethodMap = {
  card: '카드결제',
  cash: '현금결제',
  transfer: '계좌이체',
};

const ReservationDetailPanel = ({ reservation, onCancel, onCheckIn }) => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [alreadySent, setAlreadySent] = useState(false);

  useEffect(() => {
    if (reservation) {
      setMessage(reservation?.message || '');
      setStatus(statusMap[reservation.status] || reservation.status);

      adminAxiosInstance.get('/api/email-log/check', {
        params: {
          email: reservation.guestEmail,
          type: '예약안내'
        }
      })
        .then(res => {
          setAlreadySent(res.data === true);
        })
        .catch(err => {
          console.error('이메일 로그 확인 실패: ', err);
        });
    }
  }, [reservation]);

  if (!reservation) {
    return (
      <div className="reservation-detail-panel empty">
        예약 건을 선택해주세요.
      </div>
    );
  }

  const handleSendEmail = async () => {
    if (window.confirm('예약 알림 메일을 보내시겠습니까?')) {
      try {
        await adminAxiosInstance.post(`/admin/reservation/${reservation.id}/notify`, {
          email: reservation.guestEmail,
          message: message,
        });

        await adminAxiosInstance.post('/api/email-log', {
          toEmail: reservation.guestEmail,
          subject: '예약 안내 메일',
          type: '예약안내',
          success: true,
          sendAt: new Date().toISOString(),
          errorMessage: null
        });

        alert('안내 메일이 성공적으로 전송되었습니다.');
        setMessage('');
        setAlreadySent(true);
      } catch (error) {
        alert('메일 전송에 실패했습니다.');
        console.error(error);

        try {
          await adminAxiosInstance.post('/api/email-log', {
            toEmail: reservation.guestEmail,
            subject: '예약 안내 메일',
            type: '예약안내',
            success: false,
            sendAt: new Date().toISOString(),
            errorMessage: error.message,
          });
        } catch (logError) {
          console.error('이메일 실패 로그 저장 실패:', logError);
        }
      }
    }
  };

  const handleCancel = async () => {
    if (window.confirm('정말 이 예약을 취소하시겠습니까?')) {
      try {
        await adminAxiosInstance.patch(`/admin/reservation/${reservation.id}/cancel`);
        setStatus('cancelled');
        alert('예약이 취소되었으며, 예약자에게 메일이 발송되었습니다.');
        onCancel?.(reservation.id);
      } catch (error) {
        alert('예약 취소를 실패했습니다.');
        console.error(error);
      }
    }
  };

  const handleCheckin = async () => {
    if (window.confirm('체크인 완료 처리 하시겠습니까?')) {
      try {
        await adminAxiosInstance.patch(`/admin/reservation/${reservation.id}/checkin`);
        setStatus('checkedin');
        onCheckIn?.(reservation.id);
      } catch (error) {
        alert('체크인 처리에 실패했습니다.');
        console.error(error);
      }
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 11) return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (digits.length === 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    return phone;
  };

  const formatDateTimeWithDay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString.replace(' ', 'T'));
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hour = `${date.getHours()}`.padStart(2, '0');
    const minute = `${date.getMinutes()}`.padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}-${month}-${day} (${weekday}) ${hour}:${minute}`;
  };

  return (
    <div className="reservation-detail-panel">
      <h3>예약 상세</h3>
      <p><strong>예약자:</strong> {reservation.guestName}</p>
      <p><strong>전화번호:</strong> {formatPhoneNumber(reservation.guestPhone)}</p>
      <p><strong>이메일:</strong> {reservation.guestEmail}</p>
      <p><strong>객실명:</strong> {reservation.roomName}({reservation.roomNumber}호)</p>
      <p><strong>체크인:</strong> {formatDateTimeWithDay(`${reservation.checkIn} ${reservation.roomCheckIn}`)}</p>
      <p><strong>체크아웃:</strong> {formatDateTimeWithDay(`${reservation.checkOut} ${reservation.roomCheckOut}`)}</p>
      <p><strong>인원:</strong> {reservation.personnel}명</p>
      <hr />
      <p><strong>결제금액:</strong> {reservation.totalPrice?.toLocaleString()}원</p>
      <p><strong>결제수단:</strong> {paymentMethodMap[reservation.paymentMethod] || reservation.paymentMethod}</p>
      <p><strong>예약상태:</strong> {statusMap[status] || status}</p>
      <p><strong>예약일:</strong> {formatDateTimeWithDay(reservation.createdAt)}</p>

      <div className="email-box">
        <label>안내 메일 보내기</label>
        {alreadySent && (
          <p className='alreadysent'>
            ※이전에 예약 안내 메일을 보낸 적 있는 사용자입니다.
          </p>
        )}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`${reservation.guestEmail}에게 보낼 안내 내용을 입력하세요.`}
        />
        <button
          className="send-email-button"
          onClick={handleSendEmail}
        >
          메일 전송
        </button>
      </div>

      {status === '예약확정' && (
        <>
          <button className="cancel-button" onClick={handleCancel}>
            예약 취소하기
          </button>
          <button className="checkin-button" onClick={handleCheckin}>
            체크인 처리하기
          </button>
        </>
      )}
    </div>
  );
};

export default ReservationDetailPanel;
