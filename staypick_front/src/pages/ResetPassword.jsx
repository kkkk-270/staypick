import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axios.post('http://localhost:8081/api/auth/password/reset', {
        token,
        newPassword,
      });

      alert('비밀번호가 성공적으로 변경되었습니다.');
      setMessage('변경 완료! 로그인 페이지로 이동해주세요.');
    } catch (err) {
      console.error(err);
      setMessage('비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있습니다.');
    }
  };

  return (
    <div className="reset-form">
      <h2>비밀번호 재설정</h2>
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={handleResetPassword}>비밀번호 변경</button>

      {message && <p className="result-message">{message}</p>}
    </div>
  );
};

export default ResetPassword;
