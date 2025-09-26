import React, { useState } from 'react';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import SideBar from '../components/SideBar';

const Main = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Header onToggleSidebar={toggleSidebar} />
      <SideBar isVisible={sidebarVisible} />
      <MainContent />
    </div>
  );
};

export default main;
