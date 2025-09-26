import React from 'react';
import sidebarCSS from '../css/sidebar.module.css';

const Sidebar = ({ visible }) => {
  return (
    <div
      className={`${sidebarCSS.sidebar} ${visible ? '' : sidebarCSS.collapsed}`}
      style={{
        zIndex: 1040,
        position: 'fixed',
        top: 0,
        left: visible ? '0' : '-220px',
        height: '100vh',
        width: '220px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        transition: 'left 0.3s',
        overflowY: 'auto',
      }}
    >
      <div className={sidebarCSS.logo} style={{ padding: '16px', fontWeight: 'bold', fontSize: '1.2rem' }}>
        🛰️ B‑RMS
      </div>
      <ul className="nav flex-column">
        <li className="nav-item">
          <a className={`nav-link ${sidebarCSS.navLink}`} href="#">
            Dashboard
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${sidebarCSS.navLink}`} href="#">
            Residents
          </a>
        </li>
        <li className="nav-item">
          <a className={`nav-link ${sidebarCSS.navLink}`} href="#">
            Reports
          </a>
        </li>
        <li className="nav-item mt-auto">
          <a className={`nav-link ${sidebarCSS.navLink} ${sidebarCSS.logout}`} href="#">
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
