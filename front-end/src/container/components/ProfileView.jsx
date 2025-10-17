import { useEffect, useState } from 'react';
import styles from '../css/profileView.module.css';
import background from '../css/login.module.css';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [currentUserId] = useState(Number(localStorage.getItem('CurrentUserId')))
  const [users] = useState(JSON.parse(localStorage.getItem('users'))[0]);

  useEffect(() => {
    const stored = users.id === currentUserId ? users : null;
      if (Object(stored) || stored.length > 0) {
        setUser(stored);
    }
  }, []);

  if (!user) return null;

  return (
    <div 
        className={`bg- ${background['bg-1']} container vh-100 align-items-center`} 
        style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >

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

      </div>
    </div>
  );
};

export default ProfileView;
