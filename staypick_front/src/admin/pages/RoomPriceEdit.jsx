import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import '../css/RoomPriceEdit.css';
import adminAxiosInstance from '../../api/adminAxiosInstance';

const RoomPriceEdit = () => {
  const { accId } = useOutletContext();
  const [roomList, setRoomList] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [editingPrice, setEditingPrice] = useState({});
  const [keyword, setKeyword] = useState('');
  const [typeFilter, setTypeFilter] = useState('전체');
  const [roomTypes, setRoomTypes] = useState(['전체']);
 
  useEffect(() => {
    if(accId) {
      adminAxiosInstance.get(`/admin/room/list?accId=${accId}`)
        .then(res => {
          const roomData = res.data.map(room => ({
            roomId: room.id,
            roomName: `${room.roomNumber}호(${room.roomName || '이름없음'})`,
            basePrice: room.price,
            weekendPrice: room.weekendPrice,
            peakPrice: room.peakPrice,
            holidayPrice: room.weekendPrice
          }));
          setRoomList(roomData);

          const uniqueTypes = Array.from(new Set(res.data.map(room => room.name ? room.name.trim() : ''))).sort();
          setRoomTypes(['전체', ...uniqueTypes]);
        })
        .catch(err => {
          console.error('객실 정보를 불러오지 못했습니다: ', err);
        });
    }
  }, [accId]);

  const handleSelect = (room) => {
    setSelectedRoom(room);
    setEditingPrice({
      basePrice: room.basePrice,
      weekendPrice: room.weekendPrice,
      peakPrice: room.peakPrice,
      holidayPrice: room.holidayPrice
    });
  };

  const handleChange = (key, value) => {
    setEditingPrice(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleBaseChange = (value) => {
    const base = Number(value);
    setEditingPrice({
      basePrice: base,
      weekendPrice: Math.round(base * 1.1),
      peakPrice: Math.round(base * 1.3),
      holidayPrice: Math.round(base * 1.1)
    });
  };

  const handleSave = () => {
    adminAxiosInstance.put('/admin/room/price', {
      roomId: selectedRoom.roomId,
      basePrice: editingPrice.basePrice,
      weekendPrice: editingPrice.weekendPrice,
      peakPrice: editingPrice.peakPrice,
      holidayPrice: editingPrice.holidayPrice
    })
    .then(() => {
      const updated = roomList.map(room =>
        room.roomId === selectedRoom.roomId
          ? { ...room, ...editingPrice }
          : room
      );
      setRoomList(updated);
      alert(`${selectedRoom.roomName} 요금이 저장되었습니다.`);
      setSelectedRoom(null);
    })
    .catch(err => {
      console.error('요금 저장 실패', err);
      alert('요금 저장 중 오류가 발생했습니다.');
    });
  };

  const filteredRooms = roomList.filter(room => {
    const matchKeyword = room.roomName.includes(keyword);
    const matchType =
      typeFilter === '전체' || room.roomName.includes(typeFilter);
    return matchKeyword && matchType;
  });

  return (
    <div className="room-rate-page">
      <h2>객실 기본 요금 수정</h2>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="객실명 검색"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === ' ') e.preventDefault();
          }}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          {roomTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="room-rate-container">
        <div className="room-rate-table">
          <table>
            <thead>
              <tr>
                <th>객실명</th>
                <th>기본요금</th>
                <th>주말</th>
                <th>성수기</th>
                <th>연휴</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => (
                <tr key={room.roomId}>
                  <td>{room.roomName}</td>
                  <td>{(room.basePrice ?? 0).toLocaleString()}원</td>
                  <td>{(room.weekendPrice ?? 0).toLocaleString()}원</td>
                  <td>{(room.peakPrice ?? 0).toLocaleString()}원</td>
                  <td>{(room.holidayPrice ?? 0).toLocaleString()}원</td>
                  <td><button onClick={() => handleSelect(room)}>수정</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedRoom && (
          <div className="edit-panel">
            <h3>{selectedRoom.roomName} 요금 수정</h3>
            <div className="edit-row">
              <label>기본 요금</label>
              <input type="number" value={editingPrice.basePrice} onChange={(e) => handleBaseChange(e.target.value)} />
            </div>
            <div className="edit-row">
              <label>주말 요금</label>
              <input type="number" value={editingPrice.weekendPrice} onChange={(e) => handleChange('weekendPrice', e.target.value)} />
            </div>
            <div className="edit-row">
              <label>성수기 요금</label>
              <input type="number" value={editingPrice.peakPrice} onChange={(e) => handleChange('peakPrice', e.target.value)} />
            </div>
            <div className="edit-row">
              <label>연휴 요금</label>
              <input type="number" value={editingPrice.holidayPrice} onChange={(e) => handleChange('holidayPrice', e.target.value)} />
            </div>
            <div className="edit-actions">
              <button onClick={handleSave}>저장</button>
              <button onClick={() => setSelectedRoom(null)}>취소</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomPriceEdit;
