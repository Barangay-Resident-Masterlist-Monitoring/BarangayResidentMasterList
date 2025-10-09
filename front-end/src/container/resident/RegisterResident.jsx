import { useState, useEffect, useRef } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';
import styles from '../css/login.module.css';

const RegisterResident = ({ userRole = 'resident', currentUserId = null }) => {
  const { fireSuccess, fireError, fireConfirm } = useSweetAlert();

  // Load residents from 'users' localStorage key
  const [residents, setResidents] = useState(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  });

  // Persist currentUserIdState from localStorage or props
  const [currentUserIdState, setCurrentUserIdState] = useState(() => {
    // Try to get saved current user id from localStorage
    const savedId = localStorage.getItem('currentUserId');
    if (savedId) return savedId;
    return currentUserId || null;
  });

  const [showModal, setShowModal] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);

  const hasLoaded = useRef(true);

  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    birthdate: '',
    age: '',
    sex: '',
    civilStatus: '',
    occupation: '',
    otherOccupation: '', // <-- added for custom occupation input
    contactNumber: '',
    role: 'Resident',
    photo: null,
    photoURL: '',
  });

  // Save residents to localStorage 'users' whenever residents state changes
  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem('users', JSON.stringify(residents));
    }
  }, [residents]);

  // Save currentUserIdState to localStorage on change (to persist login)
  useEffect(() => {
    if (currentUserIdState) {
      localStorage.setItem('currentUserId', currentUserIdState);
    } else {
      localStorage.removeItem('currentUserId');
    }
  }, [currentUserIdState]);

  const currentResident = residents.find((r) => r.id === currentUserIdState);

  const generateId = () => Math.floor(Math.random() * 100000).toString();

  const openModal = (resident = null) => {
    if (resident) {
      setFormData({ ...resident, otherOccupation: '' }); // reset otherOccupation on edit (or you can set based on condition)
    } else {
      setFormData({
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        birthdate: '',
        age: '',
        sex: '',
        civilStatus: '',
        occupation: '',
        otherOccupation: '',
        contactNumber: '',
        role: 'Resident',
        photo: null,
        photoURL: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'photo') {
      const file = files[0];
      if (file) {
        const photoURL = URL.createObjectURL(file);
        setFormData({ ...formData, photo: file, photoURL });
      }
    } else if (name === 'birthdate') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData({ ...formData, birthdate: value, age: age.toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Maximum birthdate for 18 years old
  const getMaxBirthdate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      firstName,
      middleName,
      lastName,
      age,
      sex,
      birthdate,
      civilStatus,
      occupation,
      otherOccupation,
      contactNumber,
      photo,
      photoURL,
    } = formData;

    // Validation
    if (
      !firstName ||
      !middleName ||
      !lastName ||
      !birthdate ||
      !age ||
      Number(age) < 18 ||
      !sex ||
      !civilStatus ||
      // occupation validation: must be selected and if Others, otherOccupation must be filled and non-empty
      !(occupation && (occupation !== 'Others' || (occupation === 'Others' && otherOccupation && otherOccupation.trim() !== ''))) ||
      !contactNumber ||
      (!photo && !photoURL)
    ) {
      if (Number(age) < 18) {
        fireError('Invalid Age', 'You must be at least 18 years old to register.');
      } else {
        fireError('Missing Data', 'Please fill all fields and upload a photo.');
      }
      return;
    }

    const occupationToSave = occupation === 'Others' ? otherOccupation.trim() : occupation;

    if (userRole === 'resident') {
      // Resident can't register again if already registered
      if (currentResident) {
        fireError('Denied', 'You are already registered. Contact admin for updates.');
        return;
      }
      const newId = generateId();
      const newResident = { ...formData, id: newId, role: 'Resident', occupation: occupationToSave };
      setResidents([...residents, newResident]);
      setCurrentUserIdState(newId);
      fireSuccess('Registered!', 'Your account has been created.');
      setShowModal(false);
      return;
    }

    // Admin edit/add logic
    if (formData.id) {
      setResidents(
        residents.map((res) =>
          res.id === formData.id ? { ...formData, occupation: occupationToSave } : res
        )
      );
      fireSuccess('Updated!', 'Resident updated.');
    } else {
      const newResident = { ...formData, id: generateId(), occupation: occupationToSave };
      setResidents([...residents, newResident]);
      fireSuccess('Added!', 'New resident added.');
    }
    setShowModal(false);
  };

  // Delete resident
  const handleDelete = (idx) => {
    fireConfirm('Are you sure?', 'This will remove the resident.').then((result) => {
      if (result.isConfirmed) {
        const removedResident = residents[idx];
        setResidents(residents.filter((_, i) => i !== idx));
        fireSuccess('Deleted', 'Resident removed.');

        if (removedResident.id === currentUserIdState) {
          setCurrentUserIdState(null);
        }
      }
    });
  };

  // --------------------- BEGIN RESIDENT VIEW ---------------------
  if (userRole === 'resident') {
    if (!currentResident) {
      return (
        <div className={`container my-5 ${styles.bg}`}>
          <h2 className={`mb-4 ${styles['forest-green-text']}`}>Resident Registration</h2>
          <button className={`btn mb-3 ${styles['forest-green']}`} onClick={() => openModal()}>
            Register Your Account
          </button>

          {showModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              onClick={closeModal}
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
              <div className="modal-dialog modal-lg" role="document" onClick={(e) => e.stopPropagation()}>
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <div className={`modal-header ${styles['forest-green']}`}>
                      <h5 className="modal-title text-white">Register Account</h5>
                      <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                    </div>

                    <div className="modal-body">
                      <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Middle Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="middleName"
                          value={formData.middleName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Birthdate</label>
                        <input
                          type="date"
                          className="form-control"
                          name="birthdate"
                          value={formData.birthdate}
                          onChange={handleChange}
                          required
                          max={getMaxBirthdate()}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Age</label>
                        <input type="number" className="form-control" name="age" value={formData.age} readOnly />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Sex</label>
                        <select
                          className="form-select"
                          name="sex"
                          value={formData.sex}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select sex</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Civil Status</label>
                        <select
                          className="form-select"
                          name="civilStatus"
                          value={formData.civilStatus}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select status</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Widowed">Widowed</option>
                          <option value="Separated">Separated</option>
                        </select>
                      </div>

                      {/* Occupation Dropdown with Others */}
                      <div className="mb-3">
                        <label className="form-label">Occupation</label>
                        <select
                          className="form-select"
                          name="occupation"
                          value={formData.occupation}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData({ ...formData, occupation: value, otherOccupation: '' });
                          }}
                          required
                        >
                          <option value="">Select occupation</option>
                          <option value="Student">Student</option>
                          <option value="Employed">Employed</option>
                          <option value="Self-Employed">Self-Employed</option>
                          <option value="Unemployed">Unemployed</option>
                          <option value="Retired">Retired</option>
                          <option value="Others">Others</option>
                        </select>
                        {formData.occupation === 'Others' && (
                          <input
                            type="text"
                            className="form-control mt-2"
                            name="otherOccupation"
                            placeholder="Please specify your occupation"
                            value={formData.otherOccupation || ''}
                            onChange={(e) => setFormData({ ...formData, otherOccupation: e.target.value })}
                            required
                          />
                        )}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Contact Number</label>
                        <input
                          type="tel"
                          className="form-control"
                          name="contactNumber"
                          value={formData.contactNumber}
                          onChange={handleChange}
                          required
                          placeholder="+639xxxxxxxxx"
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Photo</label>
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          className="form-control"
                          onChange={handleChange}
                          required
                        />
                        {formData.photoURL && (
                          <img
                            src={formData.photoURL}
                            alt="Preview"
                            className="mt-2 img-thumbnail"
                            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeModal}>
                        Close
                      </button>
                      <button type="submit" className={`btn bg- ${styles['forest-green']}`}>
                        Register
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Resident profile view
    return (
      <div className={`container my-5 ${styles.bg}`}>
        <h2 className={`mb-4 ${styles['forest-green-text']}`}>Resident Profile</h2>
        <div className="card p-4">
          <img
            src={currentResident.photoURL}
            alt="Resident"
            style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
            onClick={() => setViewPhoto(currentResident.photoURL)}
          />
          <h3 className="mt-3">
            {currentResident.firstName} {currentResident.middleName} {currentResident.lastName}
          </h3>
          <p>Age: {currentResident.age}</p>
          <p>Sex: {currentResident.sex}</p>
          <p>Birthdate: {currentResident.birthdate}</p>
          <p>Civil Status: {currentResident.civilStatus}</p>
          <p>Occupation: {currentResident.occupation}</p>
          <p>Contact Number: {currentResident.contactNumber}</p>
        </div>
      </div>
    );
  }

  // Admin/Secretary view (unchanged here)
  return <div>Admin/Secretary view remains unchanged...</div>;
};

export default RegisterResident;
