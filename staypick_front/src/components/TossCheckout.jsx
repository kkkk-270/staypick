import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import '../css/components/Toss.css';

export function TossCheckout() {
  const navigate = useNavigate();
  const location = useLocation();

  const finalPrice = location.state?.finalPrice;
  const hotel = location.state?.hotel;
  const room = location.state?.room;

  useEffect(() => {
    if (!finalPrice || !hotel || !room) {
      alert("결제 정보가 유효하지 않습니다.");
      navigate("/");
    }
  }, [finalPrice, hotel, room, navigate]);

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/toss/prepare-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          orderName: `${hotel?.name || '이름없는숙소'} ${room?.roomType || '기본객실'} 숙박 1박`,
          amount: finalPrice,
          method: "card",
          customerName: "테스트유저",
          customerEmail: "test@staypick.com",
          successUrl: "http://localhost:5173/tosssuccess",
          failUrl: "http://localhost:5173/tossfail"
        })
      });

      if (!response.ok) {
        throw new Error("결제 준비 요청 실패");
      }

      const json = await response.json();

      // 💾 sessionStorage 저장
      sessionStorage.setItem("staypick_hotel", JSON.stringify(hotel));
      sessionStorage.setItem("staypick_room", JSON.stringify(room));
      sessionStorage.setItem("staypick_price", finalPrice);

      // 결제창 이동
      window.location.href = json.paymentUrl;

    } catch (error) {
      console.error("❌ 결제 요청 중 오류:", error);
      alert("결제를 진행할 수 없습니다.");
    }
  };

  return (
    <div className="wrapper">
      <div className="box_section">
        <h2>결제 정보 확인</h2>
        <p>숙소: {hotel?.name}</p>
        <p>객실: {room?.roomType}</p>
        <p>총 결제금액: {finalPrice?.toLocaleString()}원</p>
        <button
          className="button"
          style={{ marginTop: "30px" }}
          onClick={handlePayment}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
