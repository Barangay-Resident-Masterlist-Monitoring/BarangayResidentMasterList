import { useState, useEffect, useRef } from 'react';
import headerCSS from '../css/header.module.css';
import { FaBars, FaBell, FaUserCircle } from 'react-icons/fa';

const Header = ({ type }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarToggled, setSidebarToggled] = useState(sessionStorage.getItem('onToggleSidebar') || 'false');

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowUserMenu(false); 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const storedValue = sessionStorage.getItem('onToggleSidebar') || 'false';
      setSidebarToggled((prev) => {
        if (prev !== storedValue) {
          return storedValue;
        }
        return prev;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav
      className={`navbar navbar-expand-lg bg- ${headerCSS.navbar} mb-4`}
      style={
        sidebarToggled === 'true'
          ? { paddingLeft: '4rem', transition: 'padding-left 0.1s' }
          : { paddingLeft: '15rem', transition: 'padding-left 0.1s'}
      }
    >
      <div className="container-fluid px-4">
        <a className={`navbar-brand ${headerCSS.brandText} text-white`} href="#">
          {type ? `${type}'s Dashboard` : 'Dashboard'}
        </a>
        <button
          className={`navbar-toggler ${headerCSS.customToggler} bg-white text-white`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarGlass"
        >
          <span className={`navbar-toggler-icon ${headerCSS.customTogglerIcon}`}></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarGlass">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2 position-relative" ref={notifRef}>
              <button
                className={`nav-link btn ${headerCSS.neonButton} text-white`}
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={toggleNotifications}
              >
                <FaBell size={20} />
              </button>

              {showNotifications && (
                <div
                  className={`position-absolute end-0 mt-2 p-2 bg-white rounded shadow ${headerCSS.chatDropdown}`}
                  style={{ minWidth: '200px', zIndex: 1, marginRight: '-8px' }}
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="dropdown-item-text text-muted small mb-2">Notifications</div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item">You have a new message</div>
                  <div className="dropdown-item">New report uploaded</div>
                  <div className="dropdown-item">System update available</div>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item text-primary" href="#">View all</a>
                </div>
              )}
            </li>

            <li className="nav-item mx-2 position-relative" ref={userMenuRef}>
              <button
                className={`nav-link btn ${headerCSS.neonButton} text-white`}
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={toggleUserMenu}
              >
                <FaUserCircle size={24} />
              </button>

              {showUserMenu && (
                <div
                  className={`position-absolute end-0 mt-2 p-2 bg-white rounded shadow ${headerCSS.chatDropdown}`}
                  style={{ minWidth: '150px', zIndex: 1, marginRight: '-5px' }}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <a className="dropdown-item" href="#">Profile</a>
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item text-danger" href="#">Logout</a>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
