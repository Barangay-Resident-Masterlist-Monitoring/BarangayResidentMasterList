import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import headerCSS from '../css/header.module.css';
import { FaBell, FaUserCircle } from 'react-icons/fa';

const Header = ({ userType }) => {
  const [username, setUsername] = useState('');
  const [users] = useState(JSON.parse(localStorage.getItem('users'))[0]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarToggled, setSidebarToggled] = useState(
    sessionStorage.getItem('onToggleSidebar') || 'false'
  );
  const navigate = useNavigate();

  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const backward = () => {
    navigate(`/${userType}/login`);
    localStorage.removeItem('lastUserId');
    sessionStorage.clear();
  };

  useEffect(() => {
    if (users.id === Number(localStorage.getItem('CurrentUserId'))) {
      setUsername(`${users.firstName}, ${users.lastName}`);
    }
  }, [sessionStorage.getItem('CurrentUserId')]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'You have a new message' },
    { id: 2, message: 'New report uploaded' },
    { id: 3, message: 'System update available' }
  ]);

  const toggleUserMenu = () => {
    setShowUserMenu((prev) => !prev);
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    setShowUserMenu(false);
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
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
      className={`navbar navbar-expand-lg ${headerCSS.navbar} mb-4`}
      style={
        sidebarToggled === 'true'
          ? { paddingLeft: '4rem', transition: 'padding-left 0.1s' }
          : { paddingLeft: '15rem', transition: 'padding-left 0.1s' }
      }
    >
    <div className="container-fluid d-flex justify-content-end px-3 px-md-4">
        <button
          className={`navbar-toggler ${headerCSS.customToggler} bg-white text-white`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarGlass"
        >
          <span
            className={`navbar-toggler-icon ${headerCSS.customTogglerIcon}`}
          ></span>
        </button>

        <div className="d-flex flex-wrap align-items-center justify-content-end justify-content-lg-start w-100 mb-3 mb-lg-0">
          <span
            className="text-white px-3 py-2 rounded-pill text-capitalize fw-bold me-2"
            style={{
              fontWeight: 'bolder',
              fontSize: '1rem',
              letterSpacing: '0.05em',
              textShadow: '0 1px 1px rgba(0,0,0,0.1)'
            }}
          >
            {username ? username : 'Dashboard'}
          </span>

          <div
            className="user-banner text-white py-2 px-3 rounded me-2"
            style={{ backgroundColor: 'forestgreen' }}
          >
            <span
              className="fst-italic text-capitalize"
              style={{ fontSize: '12px' }}
            >
              Admin No: {localStorage.getItem('CurrentUserId') ?? '--'}
            </span>
          </div>

          <div className="badge bg-white text-black px-3 py-1 rounded">
            <span className="text-capitalize">{userType}</span>
          </div>
        </div>

        <div className="collapse navbar-collapse justify-content-end" id="navbarGlass">
          <ul className="navbar-nav align-items-end mb-2 mb-lg-0">
            <li className="nav-item mx-2 position-relative" ref={notifRef}>
              <button
                className={`nav-link btn ${headerCSS.neonButton} text-white position-relative`}
                style={{ background: 'none', border: 'none', padding: 0 }}
                onClick={toggleNotifications}
              >
                <FaBell size={20} />
                {notifications.length > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-8px',
                      background: '#dc3545',
                      color: 'white',
                      borderRadius: '50%',
                      padding: '0 6px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      boxShadow: '0 0 2px rgba(0,0,0,0.2)'
                    }}
                  >
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div
                  className={`position-absolute end-0 mt-2 p-2 bg-white rounded shadow ${headerCSS.chatDropdown}`}
                  style={{ minWidth: '200px', zIndex: 1, marginRight: '-8px' }}
                  onMouseLeave={() => setShowNotifications(false)}
                >
                  <div className="dropdown-item-text text-muted small mb-2">
                    Notifications
                  </div>
                  <div className="dropdown-divider"></div>
                  {notifications.length > 0 ? (
                    notifications.map((note) => (
                      <button
                        key={note.id}
                        className="dropdown-item text-start"
                        onClick={() => handleNotificationClick(note.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          width: '100%',
                          padding: '0.25rem 1rem',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {note.message}
                      </button>
                    ))
                  ) : (
                    <div className="dropdown-item text-muted small">
                      No new notifications
                    </div>
                  )}
                  <div className="dropdown-divider"></div>
                  <a className="dropdown-item text-primary" href="#">
                    View all
                  </a>
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
                  className={`position-absolute end-0 mt-2 p-2 bg-white rounded shadow-lg ${headerCSS.chatDropdown}`}
                  style={{ minWidth: '150px', zIndex: 1, marginRight: '-5px' }}
                  onMouseLeave={() => setShowUserMenu(false)}
                >
                  <a
                    className="dropdown-item"
                    href={`/${sessionStorage.getItem('userType')}/profile-view`}
                  >
                    Profile
                  </a>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={backward}>
                    Logout
                  </button>
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
