import { useEffect, useState } from 'react';
import styles from '../css/profileView.module.css';
import background from '../css/login.module.css';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [currentUserId] = useState(Number(localStorage.getItem('CurrentUserId')));
  const [users] = useState(JSON.parse(localStorage.getItem('users'))[0]);

  useEffect(() => {
    const stored = users.id === currentUserId ? users : null;
    if (stored) {
      setUser(stored);
    }
  }, [currentUserId, users]);

  if (!user) return null;

  return (
    <div
      className={`container-fluid ${background['bg-1']} d-flex justify-content-center align-items-center`}
      style={{ minHeight: '100vh', padding: '1rem' }}
    >
      <div className={`card ${styles.profileCard} col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4 p-4`}>
        <div className="text-center mb-4">
          <img
            src={user.photoURL || 'https://via.placeholder.com/150'}
            className="rounded-circle border border-2 border-success"
            alt="Profile"
            style={{ width: '120px', height: '120px', objectFit: 'cover', maxWidth: '100%' }}
          />
        </div>

        <h2 className={`text-center ${styles.profileName} mb-1`}>
          {user.firstName} {user.middleName} {user.lastName}
        </h2>
        <p className={`text-center ${styles.profileRole} mb-4`}>{user.role ?? "--"}</p>

        <ul className="list-group list-group-flush">
          <li className="list-group-item d-flex justify-content-between flex-wrap">
            <span>Age</span> <span className={styles.profileInfo}>{user.age ?? "--"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between flex-wrap">
            <span>Sex</span> <span className={styles.profileInfo}>{user.sex ?? "--"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between flex-wrap">
            <span>Birthdate</span> <span className={styles.profileInfo}>{user.birthdate ?? "--"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between flex-wrap">
            <span>Civil Status</span> <span className={styles.profileInfo}>{user.civilStatus ?? "--"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between flex-wrap">
            <span>Occupation</span> <span className={styles.profileInfo}>{user.occupation ?? "--"}</span>
          </li>
          <li className="list-group-item d-flex justify-content-between flex-wrap">
            <span>Contact</span> <span className={styles.profileInfo}>{user.contactNumber ?? "--"}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileView;
