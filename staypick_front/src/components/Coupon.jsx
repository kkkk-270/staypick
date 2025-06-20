import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const Coupon = ({ onCouponSelect }) => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const [isUseCoupon, setIsUseCoupon] = useState(false);
  const [isCouponDropdownOpen, setIsCouponDropdownOpen] = useState(false);
  const [isNoCoupon, setIsNoCoupon] = useState(true);

  const handleCouponBox = (event) => {
    const checked = event.target.checked;
    setIsUseCoupon(checked);
    setIsCouponDropdownOpen(checked);
    if (checked) {
      setIsNoCoupon(false);
    } else {
      setIsCouponDropdownOpen(false);
      setIsNoCoupon(!selectedCoupon);
      setSelectedCoupon(null);
      onCouponSelect?.(null);
    }
  };

  const handleNoCouponBox = (event) => {
    const checked = event.target.checked;
    setIsNoCoupon(checked);
    setIsUseCoupon(!checked);
    setIsCouponDropdownOpen(!checked);
    if (checked) {
      setSelectedCoupon(null);
      onCouponSelect?.(null);
    }
  };

  const handleSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);
    setIsUseCoupon(true);
    setIsCouponDropdownOpen(false);
    setIsNoCoupon(false);
    onCouponSelect?.(coupon);
  };

  useEffect(() => {
    axiosInstance
      .get('/coupons')  // ✅ 서버 연동 버전
      .then((res) => setCoupons(res.data))
      .catch((err) => console.error('쿠폰 데이터 로딩 실패', err));
  }, []);

  return (
    <>
      <div className="text-wrapper-3">할인</div>
      <div className="rectangle-4 py-1">
        <input
          type="checkbox"
          className="inputcheckcircle ms-3"
          checked={isNoCoupon}
          onChange={handleNoCouponBox}
        />
        <span className="ms-1">선택안함</span>
      </div>
      <div className="rectangle-4 py-1">
        <input
          type="checkbox"
          className="inputcheckcircle ms-3"
          checked={isUseCoupon}
          onChange={handleCouponBox}
        />
        <span className="ms-1">할인 쿠폰 사용</span>
        {selectedCoupon && (
          <span className="text.secondary"> ({`[${selectedCoupon.accName}]${selectedCoupon.periodName} ${selectedCoupon.discountValue}${selectedCoupon.discountType === 'PERCENT' ? '%' : '원'}`})</span>
        )}
      </div>
      <div className={`coupon-dropdown ${isCouponDropdownOpen ? 'open' : ''}`}>
        <div className="div">
          {Array.isArray(coupons) &&
            coupons.map((coupon) => (
              <div className="couponbox" key={coupon.id}>
                <div className="couponinfo">
                  <div className="text-wrapper-39">[{coupon.accName}]{coupon.periodName} {coupon.discountValue}{coupon.discountType === 'PERCENT' ? '%' : '원'}</div>
                  <p className="text-wrapper-41">유효기간: {coupon.startDate} ~ {coupon.endDate}</p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleSelectCoupon(coupon)}
                >
                  선택하기
                </button>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Coupon;
