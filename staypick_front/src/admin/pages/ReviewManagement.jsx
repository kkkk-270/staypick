import React, { useEffect, useState } from 'react';
import adminAxiosInstance from '../../api/adminAxiosInstance';
import ReviewImageModal from '../../components/ReviewImageModal';
import '../css/ReviewManagement.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState('전체');
  const [sortOrder, setSortOrder] = useState('desc');

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await adminAxiosInstance.get('/api/admin/reviews');
        const reviewArray = Array.isArray(res.data) ? res.data : res.data.reviews || [];
        setReviews(reviewArray.map(r => ({ ...r, status: r.status || 'active' })));
        setSelected(reviewArray[0] || null);
      } catch (err) {
        console.error('리뷰 불러오기 실패:', err);
      }
    };
    fetchReviews();
  }, []);

  const filteredReviews = reviews
    .filter(r => {
      if (ratingFilter !== '전체' && r.rating !== parseInt(ratingFilter)) return false;
      if (search && !(
        r.username?.includes(search) ||
        r.roomName?.includes(search) ||
        r.content?.includes(search)
      )) return false;
      return true;
    })
    .sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  // 상태 토글 (숨김/게시)
  const handleToggleStatus = async (id) => {
    try {
      await adminAxiosInstance.patch(`/api/admin/reviews/${id}/toggle`);
      setReviews(prev =>
        prev.map(r => r.id === id ? { ...r, status: r.status === 'active' ? 'hidden' : 'active' } : r)
      );
      if (selected?.id === id) {
        setSelected(prev => ({ ...prev, status: prev.status === 'active' ? 'hidden' : 'active' }));
      }
    } catch (err) {
      console.error('상태 변경 실패:', err);
    }
  };

  // 리뷰 삭제
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await adminAxiosInstance.delete(`/api/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
    }
  };

  // 이미지 모달 열기
  const openModal = (images, startIndex = 0) => {
    setModalImages(images);
    setModalStartIndex(startIndex);
    setIsModalOpen(true);
  };

  return (
    <div className="review-page">
      <h2>리뷰 관리</h2>

      <div className="review-filter-bar">
        <select value={ratingFilter} onChange={(e) => setRatingFilter(e.target.value)}>
          <option value="전체">전체 평점</option>
          {[5, 4, 3, 2, 1].map(r => (
            <option key={r} value={r}>{r}점</option>
          ))}
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
        <input
          type="text"
          placeholder="작성자, 객실명, 내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === ' ') e.preventDefault();
          }}
        />
      </div>

      <div className="review-layout">
        <div className="review-table-wrapper">
          <table className="review-table">
            <thead>
              <tr>
                <th>작성자</th>
                <th>객실</th>
                <th>평점</th>
                <th>내용</th>
                <th>작성일</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((r) => (
                <tr key={r.id} className={selected?.id === r.id ? 'selected' : ''}>
                  <td>{r.username}</td>
                  <td>{r.roomName}</td>
                  <td>{'★'.repeat(r.rating)}</td>
                  <td className="preview">{r.content.slice(0, 20)}...</td>
                  <td>{r.createdAt?.slice(0, 10)}</td>
                  <td>
                    <span className={r.status === 'active' ? 'status-active' : 'status-hidden'}>
                      {r.status === 'active' ? '게시 중' : '숨김'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => setSelected(r)}>보기</button>
                    <button onClick={() => handleToggleStatus(r.id)}>
                      {r.status === 'active' ? '숨기기' : '복구'}
                    </button>
                    <button onClick={() => handleDelete(r.id)}>삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="review-panel">
          {selected ? (
            <>
              <h3>리뷰 상세</h3>
              <p><strong>작성자:</strong> {selected.username}</p>
              <p><strong>객실:</strong> {selected.roomName}</p>
              <p><strong>평점:</strong> {'★'.repeat(selected.rating)}</p>
              <p><strong>작성일:</strong> {selected.createdAt?.slice(0, 10)}</p>
              <p>
                <strong>상태:</strong>{' '}
                <span className={selected.status === 'active' ? 'status-active' : 'status-hidden'}>
                  {selected.status === 'active' ? '게시 중' : '숨김'}
                </span>
              </p>

              <div className="content-white-box">
                <p><strong>내용:</strong></p>
                <div>{selected.content}</div>
              </div>

              {selected.imageUrls?.length > 0 && (
                <div className="image-preview-placeholder">
                  <p><strong>리뷰 이미지</strong></p>
                  <div className="image-box">
                    {selected.imageUrls.slice(0, 2).map((url, i) => (
                      <img
                        key={i}
                        src={`http://localhost:8081${url}`}
                        alt={`리뷰 이미지 ${i + 1}`}
                        className="review-thumb"
                        onClick={() => openModal(selected.imageUrls, i)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                    {selected.imageUrls.length > 2 && (
                      <div
                        className="more-images"
                        onClick={() => openModal(selected.imageUrls, 2)}
                        style={{ cursor: 'pointer' }}
                      >
                        +{selected.imageUrls.length - 2}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="panel-actions">
                <button onClick={() => handleToggleStatus(selected.id)}>
                  {selected.status === 'active' ? '숨기기' : '복구'}
                </button>
                <button onClick={() => handleDelete(selected.id)}>삭제</button>
              </div>
            </>
          ) : (
            <p className="review-detail-empty">리뷰를 선택해주세요.</p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ReviewImageModal
          images={modalImages}
          initialIndex={modalStartIndex}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ReviewManagement;
