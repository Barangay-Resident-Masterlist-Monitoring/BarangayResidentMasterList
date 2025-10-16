import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useSweetAlert from '../hooks/useSweetAlert';
import styles from '../css/login.module.css';

const RegisterResident = () => {
  const { fireSuccess, fireError } = useSweetAlert();
  const navigate = useNavigate();

  const [residents, setResidents] = useState(() => {
    const stored = localStorage.getItem('users');
    return stored ? JSON.parse(stored) : [];
  });

  const [lastUserId] = useState(localStorage.getItem('CurrentUserId') || null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);
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

  const openModal = (resident = null) => {
    if (resident) {
      setFormData({ ...resident, otherOccupation: '' });
    } else {
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
    }
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          photo: file,
          photoURL: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const {
      birthdate,
      age,
      sex,
      civilStatus,
      occupation,
      otherOccupation,
      contactNumber,
      photoURL
    } = formData;

    if (
      !birthdate ||
      !age ||
      Number(age) < 18 ||
      !sex ||
      !civilStatus ||
      !(occupation && (occupation !== 'Others' || (occupation === 'Others' && otherOccupation && otherOccupation.trim() !== ''))) ||
      !contactNumber ||
      !photoURL
    ) {
      if (Number(age) < 18) {
        fireError('Invalid Age', 'You must be at least 18 years old to register.');
      } else {
        fireError('Missing Data', 'Please fill all fields.');
      }
      return;
    }

    const occupationToSave = occupation === 'Others' ? otherOccupation.trim() : occupation;

    if (!lastUserId) {
      fireError('Not Found', 'No resident to update.');
      return;
    }

    const updatedResidents = residents.map((resident) => {
      if (resident.id === Number(lastUserId)) {
        return {
          ...resident,
          birthdate,
          age,
          sex,
          civilStatus,
          occupation: occupationToSave,
          otherOccupation: occupation === 'Others' ? otherOccupation.trim() : resident.otherOccupation,
          contactNumber,
          photoURL
        };
      }
      return resident;
    });

    const updatedResident = updatedResidents.find((resident) => resident.id === Number(lastUserId));

    if (updatedResident) {
      setResidents(updatedResidents);
      localStorage.setItem('users', JSON.stringify(updatedResidents));
      fireSuccess('Updated!', 'Resident information updated successfully.');
    } else {
      fireError('Not Found', 'Resident not found in local storage.');
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
      <div className={`d-flex justify-content-between align-items-center mb-4`}>
        <h2 className={`text-center ${styles['forest-green-text']}`}>Resident Registration</h2>
        <button className={`btn mb-3 ${styles['forest-green']}`} onClick={() => openModal()}>
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
                      type="text"
                      className="form-control"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Photo</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={handlePhotoChange}
                      accept="image/*"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Close
                  </button>
                  <button type="submit" className={`btn ${styles['forest-green']}`}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <ProfileViewer />
      )}

      {showProfileModal && selectedResident && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          onClick={() => setShowProfileModal(false)}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg" role="document" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedResident.firstName} {selectedResident.lastName} - Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProfileModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {selectedResident.photoURL && (
                  <img
                    src={selectedResident.photoURL}
                    alt="Resident Photo"
                    className="img-fluid mx-auto d-block"
                    style={{ maxWidth: '300px' }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterResident;
