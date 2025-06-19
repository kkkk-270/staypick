import React, {useEffect, useState} from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/AdminHeader';
import AdminSidebar from '../components/AdminSidebar';
import '../css/AdminLayout.css';

const AdminLayout = () => {
  const [accId, setAccId] = useState(null);
  return (
    <div className="admin-layout">
      <AdminHeader />
      <div className="admin-body">
        <AdminSidebar setAccId={setAccId} />
        <main className="admin-content">
          <Outlet context={{ accId }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
