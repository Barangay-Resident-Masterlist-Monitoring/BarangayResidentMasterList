import { useState, useEffect, useRef } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';
import styles from '../css/login.module.css';

const RegisterResident = () => {
  const { fireSuccess, fireError } = useSweetAlert();

  const [residents, setResidents] = useState(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  });

  const lastUserId = localStorage.getItem('CurrentUserId');

  const [isUserRegistered, setIsUserRegistered] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
  const [users] = useState(JSON.parse(localStorage.getItem('users'))?.[0] || {});
  const [isEmpty, setisEmpty] = useState(false);
  const hasLoaded = useRef(true);

  const [formData, setFormData] = useState({
    birthdate: '',
    age: '',
    sex: '',
    civilStatus: '',
    occupation: '',
    otherOccupation: '',
    contactNumber: '',
    role: 'Resident',
    photo: null,
    photoURL: ''
  });

  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem('users', JSON.stringify(residents));
    }
    hasLoaded.current = false;
  }, [residents]);

  useEffect(() => {
    if (!lastUserId || residents.length === 0) {
      setIsUserRegistered(false);
      return;
    }

    const user = residents.find(r => r.id === Number(lastUserId));

    if (!user) {
      setIsUserRegistered(false);
      return;
    }

    const registered =
      user.birthdate &&
      user.age &&
      Number(user.age) >= 1 &&
      user.sex &&
      user.civilStatus &&
      user.occupation &&
      user.contactNumber;

    setIsUserRegistered(Boolean(registered));

    if (users.photoURL === null) {
      setisEmpty(true);
    } else {
      setisEmpty(false);
    }
  }, [lastUserId, residents, users]);

  const openModal = (resident = null) => {
    if (isUserRegistered) {
      fireError(
        'Registration Not Allowed',
        'You have already registered your account. Please update your information instead.'
      );
      return;
    }

    setFormData({
      birthdate: '',
      age: '',
      sex: '',
      civilStatus: '',
      occupation: '',
      otherOccupation: '',
      contactNumber: '',
      role: 'Resident',
      photo: null,
      photoURL: ''
    });
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'birthdate') {
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

  const getMaxBirthdate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    return today.toISOString().split('T')[0];
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      getBase64(file)
        .then((base64) => {
          setFormData((prevData) => ({
            ...prevData,
            photo: file,
            photoURL: base64
          }));
        })
        .catch(() => {
          fireError('Photo Error', 'Failed to process the photo.');
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      birthdate,
      age,
      sex,
      civilStatus,
      occupation,
      otherOccupation,
      contactNumber,
      photo,
      photoURL
    } = formData;

    if (
      !birthdate ||
      !age ||
      Number(age) < 1 ||
      !sex ||
      !civilStatus ||
      !(occupation && (occupation !== 'Others' || (occupation === 'Others' && otherOccupation && otherOccupation.trim() !== ''))) ||
      !contactNumber ||
      (isEmpty && !photoURL)
    ) {
      if (Number(age) < 1) {
        fireError('Invalid Age', 'You must be at least 1 years old to register.');
      } else {
        fireError('Missing Data', 'Please fill all fields.');
      }
      return;
    }

    const occupationToSave = occupation === 'Others' ? otherOccupation.trim() : occupation;

    let base64PhotoURL = photoURL;
    if (photo && !photoURL.startsWith('data:')) {
      try {
        base64PhotoURL = await getBase64(photo);
      } catch (error) {
        fireError('Photo Error', 'Failed to process the photo.');
        return;
      }
    }

    if (lastUserId) {
      // UPDATE existing resident
      const idToUpdate = Number(lastUserId);
      const updatedResidents = residents.map((resident) => {
        if (resident.id === idToUpdate) {
          return {
            ...resident,
            birthdate,
            age,
            sex,
            civilStatus,
            occupation: occupationToSave,
            otherOccupation: occupation === 'Others' ? otherOccupation.trim() : '',
            contactNumber,
            photoURL: base64PhotoURL
          };
        }
        return resident;
      });

      setResidents(updatedResidents);
      localStorage.setItem('users', JSON.stringify(updatedResidents));

      fireSuccess('Updated!', 'Your account has been updated successfully.');
    } else {
      // CREATE new resident
      const newId = residents.length > 0 ? Math.max(...residents.map(r => r.id)) + 1 : 1;

      const newResident = {
        id: newId,
        birthdate,
        age,
        sex,
        civilStatus,
        occupation: occupationToSave,
        otherOccupation: occupation === 'Others' ? otherOccupation.trim() : '',
        contactNumber,
        role: 'Resident',
        photoURL: base64PhotoURL
      };

      const updatedResidents = [...residents, newResident];
      setResidents(updatedResidents);
      localStorage.setItem('users', JSON.stringify(updatedResidents));
      localStorage.setItem('CurrentUserId', String(newId));

      fireSuccess('Registered!', 'Your account has been registered successfully.');
    }

    setShowModal(false);
  };

  const ProfileViewer = () => (
    <div className={`container my-5 ${styles.bg}`}>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Birthdate</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Civil Status</th>
              <th>Occupation</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center">No data</td>
              </tr>
            ) : (
              residents.map((resident) => (
                <tr key={resident.id}>
                  <td>{resident.id}</td>
                  <td>{resident.firstName} {resident.lastName}</td>
                  <td>{resident.birthdate}</td>
                  <td>{resident.age}</td>
                  <td>{resident.sex}</td>
                  <td>{resident.civilStatus}</td>
                  <td>{resident.occupation}</td>
                  <td>{resident.contactNumber}</td>
                  <td>
                    <button
                      className={`btn btn-info ${styles['forest-green']}`}
                      onClick={() => {
                        setSelectedResident(resident);
                        setShowProfileModal(true);
                      }}
                    >
                      View Photo
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className={`container h-100 my-5 ${styles.bg}`}>
      <div className={`d-flex justify-content-between align-items-center mb-4 flex-column flex-md-row`}>
        <h2 className={`text-center ${styles['forest-green-text']}`}>Resident Registration</h2>

        <button
          className={`btn mb-3 ${styles['forest-green']}`}
          onClick={() => openModal()}
          disabled={isUserRegistered}
          title={isUserRegistered ? "You have already registered" : "Register Your Account"}
        >
          Register Your Account
        </button>
      </div>

      {showModal ? (
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
                      <option value="">Select Sex</option>
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
                      <option value="">Select Civil Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Widowed">Widowed</option>
                      <option value="Separated">Separated</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Occupation</label>
                    <select
                      className="form-select"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Occupation</option>
                      <option value="Employee">Employee</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Unemployed">Unemployed</option>
                      <option value="Student">Student</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>

                  {formData.occupation === 'Others' && (
                    <div className="mb-3">
                      <label className="form-label">Other Occupation</label>
                      <input
                        type="text"
                        className="form-control"
                        name="otherOccupation"
                        value={formData.otherOccupation}
                        onChange={handleChange}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Contact Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Photo Upload</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handlePhotoChange}
                      required={isEmpty}
                    />
                    {formData.photoURL && (
                      <img
                        src={formData.photoURL}
                        alt="Preview"
                        style={{ marginTop: '15px', maxWidth: '200px', maxHeight: '200px' }}
                      />
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="submit" className={`btn ${styles['forest-green']}`}>
                    Submit
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}

      <ProfileViewer />

      {showProfileModal && selectedResident && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowProfileModal(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedResident.firstName} {selectedResident.lastName} Photo</h5>
                <button type="button" className="btn-close" onClick={() => setShowProfileModal(false)}></button>
              </div>
              <div className="modal-body d-flex justify-content-center">
                <img
                  src={selectedResident.photoURL}
                  alt={`${selectedResident.firstName} ${selectedResident.lastName}`}
                  style={{ maxWidth: '100%', maxHeight: '400px' }}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowProfileModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterResident;
