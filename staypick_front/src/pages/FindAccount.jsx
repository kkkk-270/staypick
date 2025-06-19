import React, { useState } from 'react';
import FindUserIdForm from '../components/FindUserIdForm';
import FindPasswordForm from '../components/FindPasswordForm';
import '../css/FindAccount.css';

const FindAccount = () => {
  const [activeTab, setActiveTab] = useState('id'); // 'id' 또는 'pw'

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="findAccountPage">
      <h1>아이디/비밀번호 찾기</h1>

      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'id' ? 'active' : ''}`}
          onClick={() => handleTabClick('id')}
        >
          아이디 찾기
        </button>
        <button
          className={`tab-button ${activeTab === 'pw' ? 'active' : ''}`}
          onClick={() => handleTabClick('pw')}
        >
          비밀번호 찾기
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'id' && <FindUserIdForm />}
        {activeTab === 'pw' && <FindPasswordForm />}
      </div>
    </div>
  );
};

export default FindAccount;