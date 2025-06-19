// RegionModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ 일반 axios로 변경
import '../css/components/RegionModal.css';

const RegionModal = ({ onSelect, onClose }) => {
  const [selectedRegion, setSelectedRegion] = useState('서울');
  const [regions, setRegions] = useState({});

  // 지역 데이터 비동기 로딩
  useEffect(() => {
    axios.get('/data/regions.json') // ✅ 일반 axios 사용
      .then((res) => setRegions(res.data))
      .catch((err) => console.error("지역 데이터 로딩 실패", err));
  }, []);

  return (
    <div className="region-modal-overlay">
      <div className="region-modal">
        <div className="modal-header">
          <span>지역선택</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* 왼쪽 지역 사이드바 */}
          <div className="region-sidebar">
            {Object.keys(regions).map((region) => (
              <button
                key={region}
                className={`region-tab ${selectedRegion === region ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* 오른쪽 지역 리스트 */}
          <div className="region-list">
            <div className="region-list-header">
              <strong>{selectedRegion}</strong>
              <button
                className="select-all"
                onClick={() => onSelect(selectedRegion)} // ✅ "서울"만 전달
              >
                전체선택
              </button>
            </div>

            <ul>
              {regions[selectedRegion]?.map((item, idx) => (
                <li key={idx}>
                  <span>{item}</span>
                  <button onClick={() => onSelect(item)}>선택</button> {/* ✅ "강남구"만 전달 */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionModal;
