
import headerCSS from '../css/header.module.css';

const Header = ({ type, onToggleSidebar }) => {
  return (
    <nav className={`navbar navbar-expand-lg bg-primary`}>
      <div className="container-fluid px-4">
        <button
          className={`btn btn-outline-light me-3 ${headerCSS.sidebarToggleBtn}`}
          onClick={onToggleSidebar}
        >
          ☰
        </button>
        <a className={`navbar-brand ${headerCSS.brandText} text-white`} href="#">
          {type ? `${type}'s Dashboard` : 'Dashboard'}
        </a>
        <button
          className={`navbar-toggler ${headerCSS.customToggler}`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarGlass"
        >
          <span className={`navbar-toggler-icon ${headerCSS.customTogglerIcon}`}></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarGlass">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item mx-2">
              <a className={`nav-link ${headerCSS.neonButton} text-white`} href="#">
                Home
              </a>
            </li>
            <li className="nav-item mx-2">
              <a className={`nav-link ${headerCSS.neonButton} text-white`} href="#">
                Residents
              </a>
            </li>
            <li className="nav-item mx-2">
              <a className={`nav-link ${headerCSS.neonButton} text-white`} href="#">
                Reports
              </a>
            </li>
            <li className="nav-item mx-2">
              <a
                className={`nav-link ${headerCSS.neonButton} ${headerCSS.logout} text-white`}
                href="#"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
