import React, { useState, useEffect } from 'react';
import FaqItem from '../components/FaqItem';
import '../css/Board.css';

const Board = () => {
  const [faqData, setFaqData] = useState({});
  const [activeCategory, setActiveCategory] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetch('/data/faqdata.json')
      .then(res => res.json())
      .then(data => {
        const allItems = Object.values(data).flat(); // 전체 항목 합치기
        const updatedData = { 전체: allItems, ...data }; // 전체 카테고리 추가
        setFaqData(updatedData);
        setActiveCategory('전체');
      })
      .catch(err => {
        console.error('FAQ 데이터를 불러오는 중 오류 발생:', err);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const filteredItems = faqData[activeCategory]?.filter(item =>
    item.question.toLowerCase().includes(searchKeyword.trim().toLowerCase())
  ) || [];

  if (!activeCategory) return <div>로딩 중...</div>;

  return (
    <div className="board faq-board">
      <h1 className="faq-title">자주 묻는 질문</h1>

      {/* 🔍 검색창 */}
      <div className="faq-search">
        <input
          type="text"
          placeholder="질문을 입력하세요."
          value={searchKeyword}
          onChange={handleSearchChange}
        />
          <button className="search-button" onClick={() => setSearchKeyword(searchKeyword)}>
    검색
  </button>
      </div>

      {/* 🗂 카테고리 탭 */}
      <div className="faq-tabs">
        {Object.keys(faqData).map((category) => (
          <button
            key={category}
            className={activeCategory === category ? 'active' : ''}
            onClick={() => {
              setActiveCategory(category);
              setSearchKeyword('');
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 📋 질문 목록 */}
      <div className="faq-list">
        {filteredItems.map((item, index) => (
          <FaqItem
            key={`${activeCategory}-${index}`}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
