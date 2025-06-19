import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminHeader.css';

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    alert('로그아웃 되었습니다.');
    navigate('/');
  }
  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        <div className="admin-header-left">
          <h1 className="admin-logo">STAYPICK ADMIN</h1>
        </div>
        <div className="admin-header-right">
          <button onClick={handleLogout} className='logout-button'>로그아웃</button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
