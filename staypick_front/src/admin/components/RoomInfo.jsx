import React, { useEffect, useState } from 'react';
import adminAxiosInstance from '../../api/adminAxiosInstance'; // ✅ 변경됨

const RoomInfo = ({ accId }) => {
  const [rooms, setRooms] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [formValues, setFormValues] = useState({});
  const [originalFormValues, setOriginalFormValues] = useState({});

  const extractTypeFromRoomName = (roomName) => {
    return roomName.replace(/[0-9]{2,}호$/, '').trim();
  };

  const groupByRoomNameType = (rooms) => {
    return rooms.reduce((acc, room) => {
      const type = extractTypeFromRoomName(room.roomName || '기타');
      if (!acc[type]) acc[type] = [];
      acc[type].push(room);
      return acc;
    }, {});
  };

  const fetchRooms = () => {
    if (!accId) return;

    adminAxiosInstance.get(`/admin/room/list?accId=${accId}`)
      .then((res) => {
        console.log("Room data raw:", res.data);
        setRooms(res.data);
        const grouped = groupByRoomNameType(res.data);
        console.log("Grouped by roomName-derived type:", grouped);
        const initialForm = {};
        for (let type in grouped) {
          initialForm[type] = {
            groupType: type,
            personnel: grouped[type][0].personnel ?? '',
            extra: grouped[type][0].extra ?? '',
            roomType: grouped[type][0].roomType ?? '',
            roomNumbers: grouped[type].map(r => r.roomNumber).join(', ')
          };
        }
        setFormValues(initialForm);
        setOriginalFormValues(initialForm);
        setEditMode({});
      })
      .catch((err) => console.error("객실 정보 불러오기 실패: ", err));
  };

  useEffect(() => {
    if (accId) fetchRooms();
  }, [accId]);

  const handleEditToggle = (groupType) => {
    setEditMode(prev => ({ ...prev, [groupType]: !prev[groupType] }));
    if (!editMode[groupType]) {
      setOriginalFormValues(prev => ({
        ...prev,
        [groupType]: formValues[groupType]
      }));
    }
  };

  const handleInputChange = (groupType, field, value) => {
    setFormValues(prev => ({
      ...prev,
      [groupType]: {
        ...prev[groupType],
        [field]: value
      }
    }));
  };

  const handleSave = async (groupType, roomIds) => {
    const {
      groupType: newGroupType,
      roomType: newRoomType,
      roomNumbers,
      personnel,
      extra
    } = formValues[groupType];

    if (!newRoomType?.trim()) {
      alert("방 타입 이름을 입력해주세요.");
      return;
    }

    const roomNumberList = roomNumbers.split(',').map(num => parseInt(num.trim())).filter(n => !isNaN(n));
    if (roomNumberList.length !== roomIds.length) {
      alert("방 번호 수가 일치하지 않습니다.");
      return;
    }

    const updateData = {
      originalGroupType: groupType,
      newRoomType,
      roomType: newRoomType,
      roomIds,
      roomNumbers: roomNumberList,
      personnel,
      extra
    };

    try {
      await adminAxiosInstance.put(`/admin/room/modify`, updateData);
      alert("수정이 완료되었습니다.");
      fetchRooms();
      setEditMode(prev => ({
        ...prev,
        [groupType]: false
      }));
    } catch (err) {
      console.error("수정 실패", err);
      alert("수정 실패");
    }
  };

  const handleCancel = (groupType) => {
    setFormValues(prev => ({
      ...prev,
      [groupType]: originalFormValues[groupType] || prev[groupType]
    }));
    setEditMode(prev => ({
      ...prev,
      [groupType]: false
    }));
  };

  if (!rooms.length) return <div>객실 정보를 불러오는 중입니다...</div>;

  const groupedByType = groupByRoomNameType(rooms);

  return (
    <div className="room-info-wrapper">
      {Object.entries(groupedByType).map(([groupType, groupedRooms]) => {
        const isEditing = editMode[groupType];
        const roomIds = groupedRooms.map(r => r.id);

        return (
          <table key={groupType} className="closeopen-grid" style={{ marginBottom: '30px', width: '100%' }}>
            <thead>
              <tr>
                <th colSpan={2} style={{ backgroundColor: '#f0f0f0' }}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formValues[groupType]?.groupType || ''}
                      onChange={e => handleInputChange(groupType, 'groupType', e.target.value)}
                    />
                  ) : (
                    formValues[groupType]?.groupType
                  )}
                  {isEditing ? (
                    <>
                      <button onClick={() => handleSave(groupType, roomIds)}>저장</button>
                      <button onClick={() => handleCancel(groupType)}>취소</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditToggle(groupType)}>수정</button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className='room-info-subtitle'>유형</th>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formValues[groupType]?.roomType || ''}
                      onChange={e => handleInputChange(groupType, 'roomType', e.target.value)}
                    />
                  ) : (
                    formValues[groupType]?.roomType
                  )}
                </td>
              </tr>
              <tr>
                <th className='room-info-subtitle'>수용 인원</th>
                <td>
                  {isEditing ? (
                    <input
                      type="number"
                      value={formValues[groupType]?.personnel || ''}
                      onChange={e => handleInputChange(groupType, 'personnel', e.target.value)}
                    />
                  ) : (
                    formValues[groupType]?.personnel
                  )}
                </td>
              </tr>
              <tr>
                <th className='room-info-subtitle'>추가 설명</th>
                <td>
                  {isEditing ? (
                    <textarea
                      rows={5}
                      value={formValues[groupType]?.extra || ''}
                      onChange={e => handleInputChange(groupType, 'extra', e.target.value)}
                    />
                  ) : (
                    (formValues[groupType]?.extra || '없음')
                      .split('\n')
                      .map((line, idx) => <div key={idx}>{line}</div>)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        );
      })}
    </div>
  );
};

export default RoomInfo;
