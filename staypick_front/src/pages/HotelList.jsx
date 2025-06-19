import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import FilterBar from '../components/FilterBar';
import HotelCard from '../components/HotelCard';
import '../css/HotelList.css';

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedType, setSelectedType] = useState('전체');
  const [selectedSort, setSelectedSort] = useState('');

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          page: currentPage - 1,
          size: pageSize,
        };

        if (selectedType && selectedType !== '전체') params.type = selectedType;
        if (selectedRegion) params.region = selectedRegion;
        if (selectedSort === 'price-asc') params.sort = 'price-asc';

        const res = await axios.get('/accommodations', { params });
        console.log("📦 accommodations 응답:", res.data);

        const { content = [], totalPages = 0 } = res.data || {};

        const hotelList = await Promise.all(
          content.map(async (hotel) => {
            try {
              const [summaryRes, roomRes] = await Promise.all([
                axios.get(`/reviews/summary/${hotel.id}`),
                axios.get(`/accommodations/${hotel.id}/rooms`)
              ]);

              const minRoomPrice = roomRes.data.length > 0
                ? Math.min(...roomRes.data.map(room => room.price))
                : 100000;

              return {
                ...hotel,
                averageRating: summaryRes.data.averageRating,
                reviewCount: summaryRes.data.reviewCount,
                price: minRoomPrice,
              };
            } catch {
              return {
                ...hotel,
                averageRating: 0,
                reviewCount: 0,
                price: 100000,
              };
            }
          })
        );

        setHotels(hotelList);
        setTotalPages(totalPages);
        setHasSearched(true);
      } catch (err) {
        console.error('❌ 호텔 데이터 로딩 실패:', err.response?.data || err.message);
        setHotels([]);
        setTotalPages(0);
      }
    };

    fetchData();
  }, [currentPage, selectedType, selectedRegion, selectedSort, checkInDate, checkOutDate, guestCount]);

  const handleSearch = () => {
    setCurrentPage(1);
    setHasSearched(true);
  };

  const handleSortChange = (sortType) => {
    setSelectedSort(sortType);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="hotel-list-page">
      <FilterBar
        selectedRegion={selectedRegion}
        selectedCategory={selectedType}
        checkInDate={checkInDate}
        checkOutDate={checkOutDate}
        guestCount={guestCount}
        onRegionChange={setSelectedRegion}
        onCategoryChange={setSelectedType}
        onSortChange={handleSortChange}
        onDateChange={(ci, co) => {
          setCheckInDate(ci);
          setCheckOutDate(co);
        }}
        onGuestChange={setGuestCount}
        onSearch={handleSearch}
      />

      <div className="hotel-card-container">
        {hotels.length > 0 ? (
          hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              guestCount={guestCount}
            />
          ))
        ) : (
          hasSearched && <p>검색 결과가 없습니다.</p>
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HotelList;
