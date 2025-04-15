
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return (
    <div className="sidebar">
      <Link to="/admin-page" className='head-title'>
        <h1>AIoT Monitor</h1>
      </Link>
      
      <ul className='sidebar-nav flex-col'>
        <NavLink to="/admin-page/user-manager" 
          className={({ isActive }: { isActive: boolean }) => (isActive ? 'active-link' : '')} 
          state={{ title: 'Quản lý tài khoản người dùng' }}>
            Quản lý người dùng
        </NavLink>

        <NavLink to="/admin-page/update-pass" 
          className={({ isActive }: { isActive: boolean }) => (isActive ? 'active-link' : '')} 
          state={{ title: 'Cập nhật mật khẩu' }}>
            Đổi mật khẩu
        </NavLink>

        <NavLink to="/admin-page/reset-pass"
          className={({ isActive }: { isActive: boolean }) => (isActive ? 'active-link' : '')} >
            Reset mật khẩu
        </NavLink>
      </ul>

      <button onClick={handleLogout} className='logout-acc flex-row'>
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
