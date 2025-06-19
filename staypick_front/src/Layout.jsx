import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import './index.css';

const Layout = () => {
  const location = useLocation();

  // 🛡️ 토스 관련 경로는 Layout 제외
  const excludedPaths = ['/tosssuccess', '/tossfail', '/tosscheckout'];
  const isExcluded = excludedPaths.some(path => location.pathname.startsWith(path));

  if (isExcluded) {
    return <Outlet />; // Header/Footer 없이 렌더링
  }

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
