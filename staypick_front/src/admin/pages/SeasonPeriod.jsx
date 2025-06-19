import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import adminAxiosInstance from '../../api/adminAxiosInstance';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../css/SeasonPeriod.css';

const SeasonPeriod = () => {
  const { accId } = useOutletContext();
  const [seasonPeriods, setSeasonPeriods] = useState([]);
  const [newPeriod, setNewPeriod] = useState({ start: null, end: null, type: '', customType: '' });
  const [activeType, setActiveType] = useState('전체');
  const [activeMonth, setActiveMonth] = useState(null);

  const typeOptions = [ '주말', '공휴일', '성수기', '연휴', '직접입력', '주말 자동 등록' ];
  const typeFilterOptions = [ '전체', '주말', '공휴일', '성수기', '연휴' ];

  const getFinalType = () => newPeriod.type === '직접입력' ? newPeriod.customType.trim() : newPeriod.type;

  const formatDate = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  };
  
  useEffect(() => {
    if(!accId) return;

    adminAxiosInstance.get(`/admin/season?accId=${accId}`)
    .then(response => {
      const data = response.data.map(item => ({
        ...item,
        start: new Date(item.startDate),
        end: new Date(item.endDate),
      }));
     setSeasonPeriods(data);
    }) 
    .catch(error => {
      console.error('시즌 기간 로드 실패: ', error);
    });
  }, [accId]);

  const handleAddPeriod = () => {
    const finalType = getFinalType();
    if (!newPeriod.start || !newPeriod.end || !finalType) {
      alert('시작일, 종료일, 기간 유형을 모두 입력해주세요.');
      return;
    }

    if (finalType === '주말 자동 등록') {
      const weekends = [];
      const current = new Date(newPeriod.start);
      const end = new Date(newPeriod.end);

      while (current <= end) {
        const day = current.getDay();
        if (day === 0 || day === 6) {
          weekends.push({ start: new Date(current), end: new Date(current), type: '주말' });
        }
        current.setDate(current.getDate() + 1);
      }
      setSeasonPeriods(prev => {
        const filteredWeekends = weekends.filter(newItem =>
          !prev.some(existing =>
            existing.type === newItem.type &&
            existing.start.getTime() === newItem.start.getTime() &&
            existing.end.getTime() === newItem.end.getTime()
          )
        )
        return [...prev, ...filteredWeekends];
      });
    } else {
      setSeasonPeriods(prev => {
        const exists = prev.some(period =>
          period.type === finalType &&
          period.start.getTime() === newPeriod.start.getTime() &&
          period.end.getTime() === newPeriod.end.getTime()
        );
        if(exists){
          alert("이미 동일한 기간과 유형이 존재합니다.");
          return prev;
        }
        return [...prev, {
          start: newPeriod.start,
          end: newPeriod.end,
          type: finalType,
        }];
      });
    }

    setNewPeriod({ start: null, end: null, type: '', customType: '' });
  };

  const handleDelete = async (index) => {
    const periodToDelete = seasonPeriods[index];

    if(!periodToDelete.id){
      setSeasonPeriods(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
      return;
    }

    try{
      await adminAxiosInstance.delete(`/admin/season/${periodToDelete.id}`);
      setSeasonPeriods(prev => {
        const updated = [...prev];
        updated.splice(index, 1);
        return updated;
      });
      alert("기간이 삭제되었습니다.");
    }catch(error){
      console.error("삭제 중 오류: ", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSave = async () => {
    if(!accId){
      alert('숙소 ID가 없습니다. 관리자 로그인을 확인해주세요.');
      return;
    }

    try{
      const formattedData = seasonPeriods.map(period => ({
        accId: accId,
        type: period.type,
        startDate: formatDate(period.start),
        endDate: formatDate(period.end)
      }));

      const response = await adminAxiosInstance.post("/admin/season/save", formattedData);
      let data = [];
      if(Array.isArray(response.data)){
        data = response.data.map(item => ({
          ...item,
          start: new Date(item.startDate),
          end: new Date(item.endDate)
        }));
      }else if(typeof response.data === "object"){
        data = [{
          ...response.data,
          start: new Date(response.data.startDate),
          end: new Date(response.data.endDate)
        }];
      }else{
        data = seasonPeriods;
      }
      alert('기간이 저장되었습니다!');
      setSeasonPeriods(data);
    }catch(error){
      console.error('저장 중 오류 발생: ', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const filteredPeriods = seasonPeriods.filter(period => {
    if (activeType !== '전체' && period.type !== activeType) return false;
    if (activeType === '주말' && activeMonth !== null) {
      const month = new Date(period.start).getMonth() + 1;
      return month === activeMonth;
    }
    return true;
  });

  return (
    <div className="season-period-page full-width">
      <h2>성수기 / 주말 기간 관리</h2>

      <div className="condition-filter single-row">
        <label>기간 유형</label>
        <select
          value={newPeriod.type}
          onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value })}>
          <option value="">-- 선택 --</option>
          {typeOptions.map((type, idx) => (
            <option key={idx} value={type}>{type}</option>
          ))}
        </select>

        {newPeriod.type === '직접입력' && (
          <input
            type="text"
            value={newPeriod.customType}
            onChange={(e) => setNewPeriod({ ...newPeriod, customType: e.target.value })}
            placeholder="직접 입력"
            onKeyDown={(e)=>{
               if(e.key === ' ') e.preventDefault();
            }}
          />
        )}

        <label>시작일</label>
        <DatePicker
          selected={newPeriod.start}
          onChange={(date) => setNewPeriod({ ...newPeriod, start: date })}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작일"
          className="datepicker"
          filterDate={newPeriod.type === '주말 자동 등록' ? (date => [0, 6].includes(date.getDay())) : undefined}
          onKeyDown={(e)=>{
            if(e.key === ' ') e.preventDefault();
          }}
        />

        <label>종료일</label>
        <DatePicker
          selected={newPeriod.end}
          onChange={(date) => setNewPeriod({ ...newPeriod, end: date })}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료일"
          className="datepicker"
          minDate={newPeriod.start}
          filterDate={newPeriod.type === '주말 자동 등록' ? (date => [0, 6].includes(date.getDay())) : undefined}
          onKeyDown={(e)=>{
            if(e.key === ' ') e.preventDefault();
          }}
        />

        <button className="add-btn" onClick={handleAddPeriod}>추가</button>
      </div>

      <div className="type-filter-bar">
        {typeFilterOptions.map(type => (
          <button
            key={type}
            className={activeType === type ? 'active' : ''}
            onClick={() => {
              setActiveType(type);
              setActiveMonth(null);
            }}>{type}</button>
        ))}
      </div>

      {activeType === '주말' && (
        <div className="month-filter-bar">
          {[...Array(12)].map((_, i) => (
            <button
              key={i + 1}
              className={activeMonth === i + 1 ? 'active' : ''}
              onClick={() => setActiveMonth(i + 1)}>{i + 1}월</button>
          ))}
        </div>
      )}

      <table className="period-table">
        <thead>
          <tr>
            <th>시작일</th>
            <th>종료일</th>
            <th>유형</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {filteredPeriods.map((period, idx) => (
            <tr key={idx}>
              <td>{period.start?.toLocaleDateString()}</td>
              <td>{period.end?.toLocaleDateString()}</td>
              <td>{period.type}</td>
              <td><button className="delete-btn" onClick={() => handleDelete(idx)}>삭제</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {seasonPeriods.length > 0 && (
        <div className="save-section">
          <button className="save-btn" onClick={handleSave}>저장</button>
        </div>
      )}
    </div>
  );
};

export default SeasonPeriod;
