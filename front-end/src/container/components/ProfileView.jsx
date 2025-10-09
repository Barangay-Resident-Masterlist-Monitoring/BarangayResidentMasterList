import { useEffect, useState } from 'react';
import styles from '../css/profileView.module.css';
import background from '../css/login.module.css';

const ProfileView = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('secretary');
    if (stored) {
      const data = JSON.parse(stored);
      if (Array.isArray(data) && data.length > 0) {
        setUser(data[0]);
      }
    }
  }, []);

  if (!user) return null;

  return (
    <div className={`${background['bg-1']} container vh-100 d-flex justify-content-center align-items-center`}>
      <div className={`card ${styles.profileCard} col-md-6 col-lg-4`}>
        <div className="text-center mb-4">
          <img
            src={user.photoURL || 'https://via.placeholder.com/150'}
            className="rounded-circle border border-2 border-success"
            alt="Profile"
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
        </div>

        <h2 className={`text-center ${styles.profileName}`}>
          {user.firstName} {user.middleName} {user.lastName}
        </h2>
        <p className={`text-center ${styles.profileRole}`}>{user.role}</p>

        <ul className="list-group list-group-flush mt-4">
          <li className="list-group-item d-flex justify-content-between">
            <span>Age</span> <span className={styles.profileInfo}>{user.age}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Sex</span> <span className={styles.profileInfo}>{user.sex}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Birthdate</span> <span className={styles.profileInfo}>{user.birthdate}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Civil Status</span> <span className={styles.profileInfo}>{user.civilStatus}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Occupation</span> <span className={styles.profileInfo}>{user.occupation}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between">
            <span>Contact</span> <span className={styles.profileInfo}>{user.contactNumber}</span>
          </li>
        </ul>

        <div className="text-center mt-4">
          <button className={`btn ${styles.btnForest} btn-lg`}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
