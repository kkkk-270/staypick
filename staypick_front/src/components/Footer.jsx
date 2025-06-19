import React from 'react'
import '../css/components/Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* 1. 브랜드 소개 */}
        <div className="footer-section">
          <h2>STAYPICK</h2>
          <p>전국 숙소 예약, STAYPICK</p>
        </div>

        {/* 2. 고객지원 및 연락처 */}
        <div className="footer-section">
          <h5>고객지원</h5>
          <p>문의: support@staypick.com</p>
          <p>고객센터: 1588-1111</p>
          <p>주소: 경기도 김포시</p>
          <p>대표: 서 동 현</p>
        </div>

        {/* 3. 정책 링크 */}
        <div className="footer-section">
          <h5>정책</h5>
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 STAYPICK. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer;