import React, { useState } from 'react';
import { RiMapPinLine } from 'react-icons/ri';
import RegionModal from './RegionModal';
import DateRangePicker from './DateRangePicker';
import '../css/components/FilterBar.css';

const FilterBar = ({ onRegionChange, onDateChange, onCategoryChange, onSearch, guestCount, onGuestChange, onSortChange }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('recommend'); // 기본값 추천순

  const types = ['전체', '호텔/모텔', '게하/한옥', '펜션/풀빌라'];

  const sortOptions = [
    { label: '추천순', value: 'recommend' },
    { label: '가격낮은 순', value: 'price-asc' }
  ];

  const handleSelect = (value) => {
    setSelectedRegion(value);
    setShowModal(false);
    onRegionChange && onRegionChange(value);
  };

  const handleDateChange = (checkIn, checkOut) => {
    setCheckInDate(checkIn);
    setCheckOutDate(checkOut);
    onDateChange && onDateChange(checkIn, checkOut);
  };

  const handleTypeClick = (typeValue) => {
    setSelectedType(typeValue);
    console.log('🧪 선택된 타입:', typeValue === '전체' ? '' : typeValue);
    onCategoryChange && onCategoryChange(typeValue === '전체' ? '' : typeValue);
  };

  const handleSearch = () => {
    onSearch && onSearch();
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSelectedSort(value);
    onSortChange && onSortChange(value);
  };

  return (
    <div className="filter-section">
      <div className="filter-row">
        <button className="region-button" onClick={() => setShowModal(true)}>
          <RiMapPinLine /> 지역선택
        </button>

        <input
          type="text"
          className="location-input"
          placeholder="지역이나 숙소를 검색해보세요"
          value={selectedRegion}
          readOnly
        />

        <DateRangePicker onDateChange={handleDateChange} />

        <div className="guest-select-wrapper">

          <select
            className="guest-select"
            value={guestCount}
            onChange={(e) => onGuestChange(Number(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}명
              </option>
            ))}
          </select>
        </div>
        
      </div>

      <div className="filter-row bottom">
        <div className="category-buttons">
          {types.map((type) => (
            <button
              key={type}
              className={`category-btn ${selectedType === type ? 'active' : ''}`}
              onClick={() => handleTypeClick(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="right-options">
          <select className="sort-dropdown" value={selectedSort} onChange={handleSortChange}>
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showModal && (
        <RegionModal
          onSelect={handleSelect}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default FilterBar;
