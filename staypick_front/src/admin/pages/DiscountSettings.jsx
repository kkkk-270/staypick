import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/DiscountSetting.css';
import adminAxiosInstance from '../../api/adminAxiosInstance';

const DiscountSetting = () => {
  const { accId } = useOutletContext();
  const [roomList, setRoomList] = useState([]);
  const [roomTypes, setRoomTypes] = useState(['전체']);
  const [activeType, setActiveType] = useState('전체');
  const [discounts, setDiscounts] = useState([]);
  const [newDiscount, setNewDiscount] = useState({
    roomId: '',
    method: '%',
    value: '',
    label: '',
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    if (!accId) return;

    let rooms = [];

    adminAxiosInstance.get(`/admin/room/list?accId=${accId}`)
      .then(res => {
        rooms = res.data.map(room => ({
          roomId: room.id,
          roomNumber: room.roomNumber,
          roomName: room.roomName
        }));

        setRoomList(rooms);

        const uniqueRoomTypes = Array.from(new Set(rooms.map(r => r.roomName))).sort();
        setRoomTypes(['전체', ...uniqueRoomTypes]);

        return adminAxiosInstance.get(`/admin/room/discount/list?accId=${accId}`);
      })
      .then(res => {
        const discountsFromServer = res.data.map(d => {
          const method = d.discountType === 'PERCENT' ? '%' : '₩';
          const value = d.discountValue != null ? d.discountValue : 0;
          const label = d.periodName || '';

          const room = rooms.find(r => r.roomId === d.roomId);
          return {
            ...d,
            startDate: new Date(d.startDate),
            endDate: new Date(d.endDate),
            method,
            value,
            label,
            discountType: d.discountType,
            discountValue: d.discountValue ?? 0,
            roomName: room ? room.roomName : `객실ID: ${d.roomId}`
          };
        });

        setDiscounts(discountsFromServer);
      })
      .catch(err => {
        console.error('데이터 불러오기 실패:', err);
      });
  }, [accId]);

  const filteredRooms = roomList.filter(room =>
    activeType === '전체' || room.roomName === activeType
  );

  const handleAdd = () => {
    const { roomId, method, value, label, startDate, endDate } = newDiscount;
    if (!roomId || value === '' || value === null || !startDate || !endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (isNaN(Number(value)) || Number(value) <= 0) {
      alert('할인 값은 0보다 큰 숫자여야 합니다.');
      return;
    }

    const isOverlap = discounts.some(d =>
      d.roomId === Number(roomId) &&
      !(endDate < d.startDate || startDate > d.endDate)
    );
    if (isOverlap) {
      alert('이미 해당 객실에 같은 기간의 할인 설정이 있습니다.');
      return;
    }

    const room = roomList.find(r => r.roomId === Number(roomId));
    setDiscounts(prevDiscounts => [...prevDiscounts, {
      ...newDiscount,
      roomName: room ? room.roomName : '',
      id: null,
      roomId: Number(roomId),
      value: Number(value)
    }]);

    setNewDiscount({
      roomId: '',
      method: '%',
      value: '',
      label: '',
      startDate: null,
      endDate: null
    });
  };

  const handleDelete = async (id) => {
    try {
      if (id) {
        await adminAxiosInstance.delete(`/admin/room/discount/${id}`);
      }
      setDiscounts(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      alert('삭제 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  const handleSaveAll = async () => {
    const hasOverlap = (list) => {
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          if (
            list[i].roomId === list[j].roomId &&
            !(list[i].endDate < list[j].startDate || list[i].startDate > list[j].endDate)
          ) {
            return true;
          }
        }
      }
      return false;
    };

    if (hasOverlap(discounts)) {
      alert('같은 객실에 중복된 기간의 할인 설정이 존재합니다.');
      return;
    }

    try {
      let updateDiscounts = [...discounts];
      for (const discount of discounts) {
        const isNew = !discount.id || discount.id === null;
        const payload = {
          id: isNew ? null : discount.id,
          roomId: Number(discount.roomId),
          periodName: discount.label,
          startDate: discount.startDate.toISOString().split('T')[0],
          endDate: discount.endDate.toISOString().split('T')[0],
          discountType: discount.method === "%" ? "PERCENT" : "AMOUNT",
          discountValue: Number(discount.value)
        };

        let response;
        if (isNew) {
          response = await adminAxiosInstance.post('/admin/room/discount', payload);
          const savedDiscount = response.data;
          updateDiscounts = updateDiscounts.map(d =>
            d.id === discount.id
              ? {
                  ...d,
                  id: savedDiscount.id,
                  roomName: d.roomName,
                  method: d.method,
                  value: d.value,
                  label: d.label,
                  startDate: new Date(savedDiscount.startDate),
                  endDate: new Date(savedDiscount.endDate)
                }
              : d
          );
        } else {
          await adminAxiosInstance.put('/admin/room/discount', payload);
        }
      }
      setDiscounts(updateDiscounts);
      alert('모든 할인 정보가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('할인 저장 실패: ', error);
      alert('할인 저장 중 오류가 발생했습니다.');
    }
  };

  if (!accId) {
    return <div>숙소 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="discount-setting-page">
      <h2>할인 판매 설정</h2>

      <div className="room-type-filter">
        {roomTypes.map(type => (
          <button
            key={type}
            className={activeType === type ? 'active' : ''}
            onClick={() => setActiveType(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="discount-form">
        <select
          value={newDiscount.roomId}
          onChange={(e) => setNewDiscount({ ...newDiscount, roomId: e.target.value })}
        >
          <option value="">객실 선택</option>
          {filteredRooms.map(room => (
            <option key={room.roomId} value={room.roomId}>
              {room.roomNumber}호 ({room.roomName})
            </option>
          ))}
        </select>

        <select
          value={newDiscount.method}
          onChange={(e) => setNewDiscount({ ...newDiscount, method: e.target.value })}
        >
          <option value="%">%</option>
          <option value="₩">₩</option>
        </select>

        <input
          type="number"
          placeholder="할인 값"
          value={newDiscount.value}
          onChange={(e) => setNewDiscount({ ...newDiscount, value: e.target.value })}
        />

        <input
          type="text"
          placeholder="기간 이름"
          value={newDiscount.label}
          onChange={(e) => setNewDiscount({ ...newDiscount, label: e.target.value })}
          onKeyDown={(e)=>{
            if(e.key === ' ') e.preventDefault();
          }}
        />

        <DatePicker
          selected={newDiscount.startDate}
          onChange={(date) => setNewDiscount({ ...newDiscount, startDate: date })}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일"
          onKeyDown={(e)=>{
            if(e.key === ' ') e.preventDefault();
          }}
        />

        <DatePicker
          selected={newDiscount.endDate}
          onChange={(date) => setNewDiscount({ ...newDiscount, endDate: date })}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일"
          minDate={newDiscount.startDate}
          onKeyDown={(e)=>{
            if(e.key === ' ') e.preventDefault();
          }}
        />

        <button onClick={handleAdd}>추가</button>
      </div>

      <table className="discount-table">
        <thead>
          <tr>
            <th>객실명</th>
            <th>할인 방식</th>
            <th>할인 값</th>
            <th>기간 이름</th>
            <th>기간</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((d, index) => (
            <tr key={d.id || index}>
              <td>{d.roomName}</td>
              <td>{d.method}</td>
              <td>{d.value}{d.method}</td>
              <td>{d.label}</td>
              <td>{`${d.startDate.toLocaleDateString()} ~ ${d.endDate.toLocaleDateString()}`}</td>
              <td>
                <button onClick={() => handleDelete(d.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {discounts.length > 0 && (
        <div className="save-all">
          <button onClick={handleSaveAll}>전체 저장</button>
        </div>
      )}
    </div>
  );
};

export default DiscountSetting;
