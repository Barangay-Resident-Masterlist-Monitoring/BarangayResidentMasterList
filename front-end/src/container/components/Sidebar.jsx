import { useState, useEffect, use } from 'react';
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

import mabalanoyLogo from '../images/mabalanoy.png';

const navItems = [
  { icon: <FaTachometerAlt />, label: 'Dashboard', href: '#' },
  { icon: <FaUsers />, label: 'Residents', href: '#' },
  { icon: <FaChartBar />, label: 'Reports', href: '#' },
];

const Sidebar = () => {
 
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => { 
      sessionStorage.setItem('onToggleSidebar', collapsed)
  }, [collapsed]);

  return (
    <div
      className="text-white d-flex flex-column position-fixed top-0 start-0 vh-100 shadow-sm"
      style={{
        width: collapsed ? '70px' : '240px',
        transition: 'width 0.3s',
        backgroundColor: '#228B22',
        zIndex: 1,
      }}
    >
      {/* Toggle Button */}
      <button
        className="btn btn-outline-light rounded-circle mx-auto my-3 d-flex align-items-center justify-content-end"
        style={{ width: 36, height: 36 }}
        onClick={() => setCollapsed((prev) => !prev)}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

     <div className="d-flex flex-column align-items-center justify-content-center py-4">

      {/* Logo Image */}
      <img
        src={mabalanoyLogo}
        alt="Barangay Logo"
        className={`img-fluid rounded-circle ${collapsed ? 'w-25' : 'w-50'} transition-all`}
        style={{ objectFit: 'cover' }}
      />

      {/* Title */}
      {!collapsed && (
        <span className="mt-2 fw-bold fs-5 text-center">
          Barangay Monitoring System
        </span>
      )}
    </div>


      {/* Divider Line */}
      <div className="border-top border-white opacity-50 mx-3 mb-3"></div>

      {/* Navigation Items */}
      <ul className="nav nav-pills flex-column px-2">
        {navItems.map((item, index) => {
          const isHovered = hoveredIndex === index;
          return (
            <li className="nav-item" key={item.label}>
              <a
                href={item.href}
                className="nav-link d-flex align-items-center px-3 py-2 rounded-pill"
                style={{
                  gap: '12px',
                  color: '#fff',
                  backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  transition: 'background-color 0.3s ease, color 0.3s ease',
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
                title={collapsed ? item.label : ''}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span
                  className="fs-5"
                  style={{
                    color: isHovered ? '#e0e0e0' : '#fff',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </span>
                {!collapsed && (
                  <span
                    style={{
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                      whiteSpace: 'normal',
                      maxWidth: 120,
                      display: 'inline-block',
                      color: isHovered ? '#e0e0e0' : '#fff',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
