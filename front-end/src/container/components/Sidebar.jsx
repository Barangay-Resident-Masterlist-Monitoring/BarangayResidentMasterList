import React, { useState } from 'react';
import {
  FaTachometerAlt,
  FaUsers,
  FaChartBar,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

const navItems = [
  { icon: <FaTachometerAlt />, label: 'Dashboard', href: '#' },
  { icon: <FaUsers />, label: 'Residents', href: '#' },
  { icon: <FaChartBar />, label: 'Reports', href: '#' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Hover state to improve animation on each nav item
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div
      className="bg-primary text-white d-flex flex-column position-fixed top-0 start-0 vh-100 shadow-sm"
      style={{
        width: collapsed ? '70px' : '240px',
        transition: 'width 0.3s',
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

      {/* Title / Logo */}
      <div className="d-flex align-items-center justify-content-center py-4">
        <span style={{ fontSize: '1.8rem' }}></span>
        {!collapsed && (
          <span
            className="ms-1 fw-bold fs-5 text-center"
            style={{
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              display: 'inline-block',
            }}
          >
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
