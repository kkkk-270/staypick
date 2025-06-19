import React, { useState } from 'react';
import axios from 'axios';

const FindUserIdForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [foundId, setFoundId] = useState(null);

  const handleFindId = async () => {
    try {
      const response = await axios.post('http://localhost:8081/api/auth/find-userid', {
        username,
        email,
      }, {
        headers: {
            Authorization: ''
        }
      });

      if (response.data?.userid) {
        setFoundId(response.data.userid);
      } else {
        alert('일치하는 계정이 없습니다.');
      }
    } catch (err) {
        if (err.response?.status === 404) {
            alert('요청한 API를 찾을 수 없습니다. (404)');
        } else if (err.response?.status === 400) {
            alert('입력한 정보가 올바르지 않습니다. 다시 확인해주세요.');
        } else {
            alert('아이디 찾기에 실패했습니다.');
        }
      console.error(err);
    }
  };

  return (
    <div className="find-form">
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
      <button onClick={handleFindId}>아이디 찾기</button>

      {foundId && (
        <p className="result-message">
          회원님의 아이디는 <strong>{foundId}</strong>입니다.
        </p>
      )}
    </div>
  );
};

export default FindUserIdForm;
