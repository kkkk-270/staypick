import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const TossSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [hotel, setHotel] = useState(null);
  const [room, setRoom] = useState(null);
  const [finalPrice, setFinalPrice] = useState(0);
  const [responseData, setResponseData] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(1);

 useEffect(() => {
  const hotelData = JSON.parse(sessionStorage.getItem("staypick_hotel"));
  const roomData = JSON.parse(sessionStorage.getItem("staypick_room"));
  const price = Number(sessionStorage.getItem("staypick_price"));
  const checkInDate = roomData?.checkin;
  const checkOutDate = roomData?.checkout;
  const guestNum = roomData?.personnel;
  const token = localStorage.getItem("token");

  if (!hotelData || !roomData || !price) {
    alert("결제 정보가 유실되었습니다.");
    return;
  }

  setHotel(hotelData);
  setRoom(roomData);
  setFinalPrice(price);
  setCheckIn(checkInDate);
  setCheckOut(checkOutDate);
  setGuestCount(guestNum);

  // ✅ 예약 저장
  const createReservation = async () => {
    try {
      const res = await fetch("/api/mypage/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          accommodationId: hotelData.id,
          roomId: roomData.id,
          roomType: roomData.roomType,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guestName: roomData.guestName,
          guestPhone: roomData.guestPhone,
          personnel: guestNum,
          visitMethod: roomData.visit,
          totalPrice: price
        })
      });

      // ✅ 중복 예약 시 처리
      if (res.status === 409) {
        const msg = await res.text();
        alert("예약 실패: " + msg);
        navigate("/"); // 홈으로 리디렉션 또는 적절한 안내 페이지
        return;
      }

      if (!res.ok) throw new Error("예약 저장 실패");

      const responseJson = await res.json();
      console.log("✅ 예약 저장 완료 - ID:", responseJson);

      sessionStorage.removeItem("staypick_hotel");
      sessionStorage.removeItem("staypick_room");
      sessionStorage.removeItem("staypick_price");

    } catch (e) {
      console.error(e);
      alert("서버 오류로 예약을 처리하지 못했습니다.");
    }
  };

  createReservation();
}, []);

  return (
    <div className="box_section" style={{ width: "600px", margin: "0 auto", textAlign: "center" }}>
      <img
        width="100px"
        src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
        alt="결제완료"
      />
      <h2>결제가 완료되었습니다!</h2>

      <div className="p-grid typography--p" style={{ marginTop: "30px", textAlign: "left" }}>
        <div className="p-grid-col"><b>숙소명:</b> {hotel?.name}</div>
        <div className="p-grid-col"><b>객실:</b> {room?.roomType} ({room?.roomNumber}호)</div>
        <div className="p-grid-col"><b>체크인:</b> {checkIn}</div>
        <div className="p-grid-col"><b>체크아웃:</b> {checkOut}</div>
        <div className="p-grid-col"><b>인원:</b> {guestCount}명</div>
        <div className="p-grid-col"><b>결제금액:</b> {finalPrice.toLocaleString()}원</div>

        {responseData?.response?.approvedAt && (
          <div className="p-grid-col">
            <b>결제일시:</b> {new Date(responseData.response.approvedAt).toLocaleString()}
          </div>
        )}
        {responseData?.response?.method && (
          <div className="p-grid-col">
            <b>결제수단:</b> {responseData.response.method}
          </div>
        )}
      </div>

      <div style={{ marginTop: "40px", display: "flex", justifyContent: "center", gap: "20px" }}>
        <button className="button" onClick={() => navigate("/")}>홈으로 이동</button>
        <button className="button" onClick={() => navigate("/mypage/reservations")}>마이페이지로 이동</button>
      </div>
    </div>
  );
};

export default TossSuccess;
