import React from 'react'
import { useOutletContext } from 'react-router-dom'
import AccommodationInfo from '../components/AccommodationInfo'
import RoomInfo from '../components/RoomInfo'
import '../css/AdminInfo.css';

const AdminInfo = () => {
  
  const {accId} = useOutletContext();

  return (
    <div className="admin-info-page full-width">
      <h2>숙소 및 객실 정보 수정</h2>
        
      <div className="panel-box">
        <div className="panel-header">
          <div className="panel-title admin-info-title">숙소 정보</div>
            <AccommodationInfo accId={accId} />
        </div>
      </div>
      <div className="panel-box">
        <div className="panel-header">
          <div className="panel-title admin-info-title">객실 정보</div>
            <RoomInfo accId={accId} />
        </div>
      </div>
    </div>
  )
}

export default AdminInfo