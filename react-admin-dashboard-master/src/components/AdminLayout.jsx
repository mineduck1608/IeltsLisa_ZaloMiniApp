import React from 'react';
import { useEffect } from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from '../scenes/global/Sidebar';
import Topbar from '../scenes/global/Topbar';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ isSidebar, setIsSidebar }) => {
  const navigate = useNavigate();
  
    useEffect(() => {
  
  
      let token = sessionStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect to home if token is not present
        return;
      }
  
    }, []);

  
  return (
    <div className="app">
      <Sidebar isSidebar={isSidebar} />
      <main className="content">
        <Topbar setIsSidebar={setIsSidebar}/>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
