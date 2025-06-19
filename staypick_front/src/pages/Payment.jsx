import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { RiInformationLine } from 'react-icons/ri';
import '../css/payment.css';
import Coupon from '../components/Coupon';
import ReservationGuide from '../components/ReservationGuide';
import UserInfoEdit from '../components/UserInfoEdit';

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : cleaned;
};

const formatKoreanDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
};

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const roomInfo = location.state?.roomInfo || {};
  const hotelData = location.state?.hotel;
  const [guestCount, setGuestCount] = useState(location.state?.guestCount || 1);
  const checkInDate = location.state?.checkInDate || '';
  const checkOutDate = location.state?.checkOutDate || '';
  const [visit, setVisit] = useState('walk');

  const [name, setName] = useState('홍길동');
  const [phone, setPhone] = useState('01012345678');
  const [isSameAsBooker, setIsSameAsBooker] = useState(true);
  const [guestName, setGuestName] = useState('홍길동');
  const [guestPhone, setGuestPhone] = useState('01012345678');
  const [guestPhoneFormatted, setGuestPhoneFormatted] = useState(formatPhoneNumber('01012345678'));

  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [couponDiscountAmount, setCouponDiscountAmount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [nights, setNights] = useState(1);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showUserInfoEditModal, setShowUserInfoEditModal] = useState(false);

  const formattedCheckInDate = formatKoreanDate(checkInDate);
  const formattedCheckOutDate = formatKoreanDate(checkOutDate);

  useEffect(() => {
    setGuestPhoneFormatted(formatPhoneNumber(guestPhone));
  }, [guestPhone]);

  useEffect(() => {
    calculateFinalPrice();
  }, [selectedCoupon, roomInfo]);

  useEffect(() => {
    const validVisit = !!visit;
    const validGuest = isSameAsBooker || (guestName && guestPhone);
    setIsPaymentEnabled(validVisit && validGuest);
  }, [visit, guestName, guestPhone, isSameAsBooker]);

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (isSameAsBooker) setGuestName(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    if (isSameAsBooker) setGuestPhone(e.target.value);
  };

  const handleSameAsBookerChange = (e) => {
    const checked = e.target.checked;
    setIsSameAsBooker(checked);
    if (checked) {
      setGuestName(name);
      setGuestPhone(phone);
    } else {
      setGuestName('');
      setGuestPhone('');
    }
  };

  const handleGuestNameChange = (e) => setGuestName(e.target.value);
  const handleGuestPhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setGuestPhone(raw);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  const handleCouponSelect = (coupon) => setSelectedCoupon(coupon);
  const handleVisit = (e) => setVisit(e.target.value);
  const handleCancelPayment = () => navigate(-1);
  const handleCloseModal = () => setShowModal(false);
  const handleCloseUserInfoEditModal = () => setShowUserInfoEditModal(false);

 const checkAvailability = async () => {
  console.log("🟢 예약 확인 파라미터", {
    roomId: roomInfo.id,
    checkIn: formatDate(checkInDate),
    checkOut: formatDate(checkOutDate)
  });

  try {
    const token = sessionStorage.getItem("token"); // ✅ 토큰 가져오기

    const res = await fetch(
      `/api/mypage/reservations/check-availability?roomId=${roomInfo.id}&checkIn=${formatDate(checkInDate)}&checkOut=${formatDate(checkOutDate)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // ✅ 헤더에 토큰 추가
        },
        credentials: "include"
      }
    );

    if (!res.ok) throw new Error("서버 응답 오류");
    const isAvailable = await res.json();
    return isAvailable;
  } catch (err) {
    console.error("❌ 예약 가능 여부 확인 중 오류:", err);
    return false;
  }
};
  const handleProceedPayment = async () => {
  if (!isPaymentEnabled) return;

  //  예약 가능 여부 먼저 확인
  const isAvailable = await checkAvailability();
  if (!isAvailable) {
    alert("회원님이 이미 같은 날짜에 예약한 객실입니다. 다른 날짜나 객실을 선택해주세요.");
    return;
  }

  // 예약 가능 → 결제 페이지 이동
  const roomPayload = {
    ...roomInfo,
    guestName,
    guestPhone,
    personnel: guestCount,
    visit,
    checkin: formatDate(checkInDate),
    checkout: formatDate(checkOutDate),
  };

  sessionStorage.setItem("staypick_room", JSON.stringify(roomPayload));
  sessionStorage.setItem("staypick_hotel", JSON.stringify(hotelData));
  sessionStorage.setItem("staypick_price", String(finalPrice));

  navigate('/tosscheckout', {
    state: {
      hotel: hotelData,
      room: roomPayload,
      finalPrice,
    }
  });
};

  const getStayNights = (checkIn, checkOut) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffTime = outDate.getTime() - inDate.getTime();
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const calculateFinalPrice = () => {
    const regular = Number(roomInfo?.regularPrice || 0);
    const discount = Number(roomInfo?.discountPrice || 0);
    const stayNights = getStayNights(checkInDate, checkOutDate);
    setNights(stayNights);

    let price = (discount < regular ? discount : regular) * stayNights;
    let couponDiscount = 0;

    if (selectedCoupon) {
      if (selectedCoupon.discountType === 'fixed') {
        couponDiscount = Number(selectedCoupon.discount);
      } else if (selectedCoupon.discountType === 'percentage') {
        couponDiscount = (price * Number(selectedCoupon.discount)) / 100;
      }
      price -= couponDiscount;
    }

    if (price < 0) price = 0;
    setCouponDiscountAmount(couponDiscount);
    setFinalPrice(price);
  };

  if (!hotelData || !roomInfo) return <div>선택된 호텔 정보가 없습니다.</div>;

  const regularFormatted = Number(roomInfo?.regularPrice || 0).toLocaleString();
  const discountAmount = Number(roomInfo?.regularPrice || 0) - Number(roomInfo?.discountPrice || 0);

  
  return (
    <div className="gray-bg">
      <Container>
        <div className="rectangle">
          <div className="text-wrapper-2">예약</div>

          <div className="text-wrapper-3">숙소</div>
          <div className="rectangle-2">
            <p>
              {hotelData.name} {roomInfo.roomType} 숙박/{nights}박
              <RiInformationLine onClick={() => setShowModal(true)} style={{ cursor: 'pointer' }} />
            </p>
          </div>

          <div className="text-wrapper-3">시간</div>
          <Row className="timebox">
            <Col md={6}>
              <div className="checkin">
                <div className="checkin-name">체크인</div>
                <div className="checkin-date">{formattedCheckInDate}</div>
                <div className="checkin-time">{roomInfo.checkin}</div>
              </div>
            </Col>
            <Col md={6}>
              <div className="checkout">
                <div className="checkout-name">체크아웃</div>
                <div className="checkout-date">{formattedCheckOutDate}</div>
                <div className="checkout-time">{roomInfo.checkout}</div>
              </div>
            </Col>
          </Row>

           <div className="text-wrapper-3 d-flex justify-content-between align-items-center" style={{ paddingRight: '120px' }}>
            <span>인원수</span>
            <div className="guest-count-controller">
              <Button
                variant="outline-secondary"
                onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              >
                –
              </Button>
              <span className="guest-count-number">{guestCount}명</span>
              <Button
                variant="outline-secondary"
                onClick={() => setGuestCount(Math.min(6, guestCount + 1))}
              >
                +
              </Button>
            </div>
          </div>

          <div className="visit-method-box">
            <div className="rectangle-3 d-flex justify-content-between align-items-center">
              <div className="text-wrapper-13">방문수단 선택</div>
              <div className="checkblock">
                {['walk', 'car'].map((type) => (
                  <Form.Check
                    inline
                    key={type}
                    type="radio"
                    name="visit"
                    value={type}
                    label={type === 'walk' ? '도보' : '차량'}
                    checked={visit === type}
                    onChange={handleVisit}
                  />
                ))}
              </div>
            </div>
          </div>



          <div className="text-wrapper-3">예약자 정보</div>
          <div className="rectangle-2">
            <p>{name} / {formatPhoneNumber(phone)}<span className="text-primary" onClick={() => setShowUserInfoEditModal(true)}>변경하기</span></p>
          </div>

          <div className="text-wrapper-3">이용자 정보</div>
          <div className="sameinfo">
            <Form.Check
              type="checkbox"
              label="예약자 정보와 같아요."
              checked={isSameAsBooker}
              onChange={handleSameAsBookerChange}
            />
          </div>
          <div className="userinfo">
            <Form.Label className="text-wrapper-34">성명</Form.Label>
            <Form.Control
              type="text"
              value={guestName}
              onChange={handleGuestNameChange}
              readOnly={isSameAsBooker}
              onKeyDown={(e) => {
                if(e.key === ' ') e.preventDefault();
              }}
            />
          </div>
          <div className="userinfo">
            <Form.Label className="text-wrapper-34">휴대폰 번호</Form.Label>
            <Form.Control
              type="tel"
              value={guestPhoneFormatted}
              onChange={handleGuestPhoneChange}
              readOnly={isSameAsBooker}
              onKeyDown={(e) => {
                if(e.key === ' ') e.preventDefault();
              }}
            />
          </div>

          <Coupon onCouponSelect={handleCouponSelect} />

          <div className="text-wrapper-6">결제 금액</div>
          <div className="text-wrapper-28">상품 금액<span>{regularFormatted}원</span></div>
          <div className="text-wrapper-28">할인 금액<span>{(discountAmount + couponDiscountAmount).toLocaleString()}원</span></div>
          <div className="text-wrapper-3 mb-5 price">
            총 결제 금액 <span>{finalPrice.toLocaleString()}원</span>
            <div className="text-muted" style={{ fontSize: '0.9rem' }}>({nights}박 기준)</div>
          </div>

          <div className="text-center mt-4">
            <Button variant="secondary" className="me-2" onClick={handleCancelPayment}>결제취소</Button>
            <Button onClick={handleProceedPayment} disabled={!isPaymentEnabled}>결제하기</Button>
          </div>
        </div>

        <ReservationGuide show={showModal} onHide={handleCloseModal} />
        <UserInfoEdit
          show={showUserInfoEditModal}
          onHide={handleCloseUserInfoEditModal}
          name={name}
          phone={phone}
          onNameChange={handleNameChange}
          onPhoneChange={handlePhoneChange}
          onSave={() => setShowUserInfoEditModal(false)}
        />
      </Container>
    </div>
  );
};

export default Payment;