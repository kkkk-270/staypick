import React, { useState } from 'react';
import '../css/AdminLogin.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState('');
  const [adminPw, setAdminPw] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try{
      const response = await axios.post('http://localhost:8081/api/auth/admin-login', {
        userid: adminId,
        password: adminPw
      });

      const {token} = response.data;
      localStorage.setItem('adminToken', token);

      // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      alert('관리자 로그인 성공');
      navigate('/admin/dashboard');
    }catch(err){
      if(err.response && err.response.data){
        setError(err.response.data);
      }else{
        setError('로그인 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
      <div className="admin-login-container">
        <h2>사장님 로그인</h2>
        <form onSubmit={handleLogin} className="admin-login-form">
          <input
            type="text"
            placeholder="아이디"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter'){
                handleLogin();
              }
              if(e.key === ' ') e.preventDefault();
            }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={adminPw}
            onChange={(e) => setAdminPw(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === 'Enter'){
                handleLogin();
              }
              if(e.key === ' ') e.preventDefault();
            }}
          />
          {error && <div className="admin-login-error">{error}</div>}
          <button type="submit" className="admin-login-btn">
            로그인
          </button>
        </form>
        <Link to="/admin/register">사장님 회원가입</Link>
      </div>
    </>
  );
};

export default AdminLogin;
