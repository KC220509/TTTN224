
import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

  const roleId = Number(localStorage.getItem("role_id"));

  return (
    <div className="sidebar">
      {roleId === 1 && 
        <>
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
          </ul>
        </>
      }

      {roleId === 2 &&
        <>
          <Link to="/teamlead-page" className='head-title'>
            <h1>TeamLead</h1>
          </Link>
          <ul className='sidebar-nav flex-col'>
            <NavLink to="/teamlead-page/device-groups" 
              className={({ isActive }: { isActive: boolean }) => (isActive ? 'active-link' : '')} 
              state={{ title: 'Quản lý thiết bị và nhóm thiết bị' }}>
                Devices & Groups
            </NavLink>
            <NavLink to="/teamlead-page/command-lists" 
              className={({ isActive }: { isActive: boolean }) => (isActive ? 'active-link' : '')} 
              state={{ title: 'Quản lý danh sách lệnh' }}>
                Command Lists
            </NavLink>
            <NavLink to="/teamlead-page/profiles" 
              className={({ isActive }: { isActive: boolean }) => (isActive ? 'active-link' : '')} 
              state={{ title: 'Quản lý danh sách lệnh' }}>
                Profiles
            </NavLink>

          </ul>
        </>
      }
      
      

      <button onClick={handleLogout} className='logout-acc flex-row'>
        Đăng xuất
      </button>
    </div>
  );
};

export default Sidebar;
