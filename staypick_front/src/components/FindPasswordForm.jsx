import React, { useState } from 'react';
import axios from 'axios';

const FindPasswordForm = () => {
  const [userid, setUserid] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSendResetLink = async () => {
    try {
      await axios.post('http://localhost:8081/api/auth/password/reset-link', {
        userid,
        username,
        email,
      });

      setSent(true);
      alert('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
    } catch (err) {
      alert('메일 전송에 실패했거나 일치하는 계정이 없습니다.');
      console.error(err);
    }
  };

  return (
    <div className="find-form">
      <input
        type="text"
        placeholder="아이디"
        value={userid}
        onChange={(e) => setUserid(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === ' ') e.preventDefault();
        }}
      />
      <input
        type="text"
        placeholder="이름"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === ' ') e.preventDefault();
        }}
      />
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if(e.key === ' ') e.preventDefault();
        }}
      />
      <button onClick={handleSendResetLink}>재설정 링크 전송</button>

      {sent && (
        <p className="result-message">
          이메일을 확인해 주세요.
        </p>
      )}
    </div>
  );
};

export default FindPasswordForm;
