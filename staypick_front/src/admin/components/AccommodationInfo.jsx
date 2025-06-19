import React, { useEffect, useState } from 'react'
import adminAxiosInstance from '../../api/adminAxiosInstance'; // ✅ 변경

const facilityFields = {
  hasPark: "주차장",
  hasCooking: "취사 가능",
  hasPickup: "픽업",
  hasRestaurant: "레스토랑",
  hasSauna: "사우나",
  hasBarbecue: "바베큐",
  hasFitness: "피트니스",
  hasPc: "PC",
  hasShower: "샤워시설",
};

const AccommodationInfo = ({ accId }) => {
  const [accommodation, setAccommodation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!accId) return;

    adminAxiosInstance
      .get(`/admin/accommodation/${accId}`)
      .then((res) => {
        setAccommodation(res.data);
        setFormData(res.data);
        setIsEditing(false);
      })
      .catch((err) => console.error(err));
  }, [accId]);

  if (!accommodation) return <div>Loading...</div>;

  const facilities = Object.entries(facilityFields)
    .filter(([key]) => accommodation[key])
    .map(([, label]) => label)
    .join(", ");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleButtonClick = () => {
    if (isEditing) {
      adminAxiosInstance
        .put(`/admin/accommodation/${accId}`, formData)
        .then(() => {
          alert("수정 완료");
          setAccommodation(formData);
          setIsEditing(false);
        })
        .catch((err) => {
          console.error(err);
          alert("수정 실패");
        });
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setFormData(accommodation);
    setIsEditing(false);
  };

  return (
    <div className="room-info-wrapper">
      <table className="closeopen-grid">
        <thead>
          <tr>
            <th colSpan={2} style={{ backgroundColor: '#f0f0f0' }}>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                />
              ) : (
                accommodation.name
              )}
              {isEditing ? (
                <>
                  <button onClick={handleButtonClick}>저장</button>
                  <button onClick={handleCancel} style={{ marginLeft: '10px' }}>취소</button>
                </>
              ) : (
                <button onClick={handleButtonClick}>수정</button>
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {[
            ["주소", "address"],
            ["전화번호", "tel"],
            ["유형", "type"],
            ["체크인 시간", "checkin"],
            ["체크아웃 시간", "checkout"],
            ["환불 규정", "refund"]
          ].map(([label, name]) => (
            <tr key={name}>
              <th>{label}</th>
              <td>
                {isEditing ? (
                  <input
                    type="text"
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  accommodation[name]
                )}
              </td>
            </tr>
          ))}

          <tr>
            <th>서비스 및 부대시설</th>
            <td>
              {isEditing ? (
                <>
                  {Object.entries(facilityFields).map(([key, label]) => (
                    <label key={key} style={{ marginRight: 10 }}>
                      <input
                        type="checkbox"
                        name={key}
                        checked={!!formData[key]}
                        onChange={handleChange}
                      />
                      {label}
                    </label>
                  ))}
                </>
              ) : (
                facilities || "없음"
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AccommodationInfo;
