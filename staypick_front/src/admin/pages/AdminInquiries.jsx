import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/adminAxiosInstance';
import '../css/AdminInquiries.css';

const AdminInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [sortOrder, setSortOrder] = useState('desc');

  // ✅ 문의 목록 불러오기
  useEffect(() => {
  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");
    console.log("✅ 토큰 확인:", token);

    try {
      const res = await axiosInstance.get('/api/admin/inquiries');
      console.log("✅ 응답 성공:", res);
      setInquiries(res.data);
    } catch (err) {
      console.error("❌ 요청 실패:", err.response?.status, err.response?.data);
    }
  };
  fetchData();
}, []);

  // ✅ 답변 저장
  const handleReplySubmit = async () => {
    if (!reply.trim()) return alert("답변을 입력해주세요.");
    try {
      await axiosInstance.patch(`/api/admin/inquiries/${selected.id}/reply`, { comment: reply });

      const updated = inquiries.map((inq) =>
        inq.id === selected.id ? { ...inq, status: 'completed', comment: reply } : inq
      );
      setInquiries(updated);
      setSelected(null);
      setReply('');
    } catch (err) {
      console.error('❌ 답변 저장 실패:', err);
      alert("답변 저장 중 오류가 발생했습니다.");
    }
  };

  // ✅ 필터 + 정렬 적용
  const filteredSortedInquiries = inquiries
    .filter(inq =>
      (statusFilter === '전체' || inq.status === statusFilter) &&
      (typeFilter === '전체' || inq.type === typeFilter)
    )
    .sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      return sortOrder === 'desc' ? bDate - aDate : aDate - bDate;
    });

  return (
    <div className="admin-inquiry-page">
      <h2>문의 관리</h2>

      {/* 🔍 필터 바 */}
      <div className="inquiry-filter-bar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="전체">전체 상태</option>
          <option value="processing">처리 중</option>
          <option value="completed">답변 완료</option>
        </select>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="전체">전체 종류</option>
          <option value="가격">가격</option>
          <option value="객실">객실</option>
          <option value="시설">시설</option>
          <option value="기타">기타</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">최신순</option>
          <option value="asc">오래된순</option>
        </select>
      </div>

      {/* 📋 문의 목록 + 📄 상세 패널 */}
      <div className="inquiry-layout">
        <div className="inquiry-table-wrapper">
          <table className="inquiry-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>사용자</th>
                <th>제목</th>
                <th>상태</th>
                <th>처리</th>
              </tr>
            </thead>
            <tbody>
              {filteredSortedInquiries.map((inq) => (
                <tr key={inq.id}>
                  <td>{inq.id}</td>
                  <td>{inq.userId}</td>
                  <td>{inq.title}</td>
                  <td>
                    {inq.status === 'completed' ? (
                      <span className="status completed">답변 완료</span>
                    ) : (
                      <span className="status processing">처리 중</span>
                    )}
                  </td>
                  <td>
                    <button onClick={() => {
                      setSelected(inq);
                      setReply(inq.comment || '');
                    }}>
                      답변/상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✏️ 답변 패널 */}
        {selected && (
          <div className="inquiry-panel">
            <h3>문의 상세</h3>
            <p><strong>유저 ID:</strong> {selected.userId}</p>
            <p><strong>숙소명:</strong> {selected.accommodationName}</p>
            <p><strong>문의 종류:</strong> {selected.type}</p>
            <p><strong>제목:</strong> {selected.title}</p>
            <p><strong>내용:</strong> {selected.content}</p>
            <p><strong>작성일자:</strong> {selected.createdAt}</p>

            <textarea
              rows={12}
              placeholder="답변 내용을 입력하세요"
              value={reply}
              onChange={(e) => setReply(e.target.value)}
            />
            <div className="reply-actions">
              <button onClick={handleReplySubmit}>답변 저장</button>
              <button onClick={() => setSelected(null)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInquiries;
