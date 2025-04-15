import React from 'react';
import '../styles/layout.css';

import Sidebar from './SideBar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
