import { useState, useEffect } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';
import styles from '../css/login.module.css';

const RegisterResident = ({ userRole = 'resident', currentUserId = null }) => {
  const { fireSuccess, fireError, fireConfirm } = useSweetAlert();

  const [residents, setResidents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    occupation: '',
    contactNumber: '',
    role: 'Resident',
    photo: null,
    photoURL: '',
  });

  const [currentUserIdState, setCurrentUserIdState] = useState(currentUserId);

  useEffect(() => {
    const stored = localStorage.getItem('secretary');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setResidents(parsed);
        }
      } catch (err) {
        console.error('Failed to parse stored residents:', err);
      }
    }
    setInitialLoadDone(true);
  }, []);


  useEffect(() => {
    if (initialLoadDone) {
      localStorage.setItem('secretary', JSON.stringify(residents));
    }
  }, [residents, initialLoadDone]);

  const currentResident = residents.find((r) => r.id === currentUserIdState);

  const generateId = () => Math.floor(Math.random() * 100000).toString();

  const openModal = (resident = null) => {
    if (resident) {
      setFormData({ ...resident });
    } else {
      setFormData({
        id: '',
        firstName: '',
        middleName: '',
        lastName: '',
        age: '',
        sex: '',
        birthdate: '',
        civilStatus: '',
        occupation: '',
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
        setFormData((prev) => ({ ...prev, photo: file, photoURL }));
      }
    } else if (name === 'birthdate') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, birthdate: value, age: age.toString() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      id,
      firstName,
      middleName,
      lastName,
      age,
      sex,
      birthdate,
      civilStatus,
      occupation,
      contactNumber,
      photo,
      photoURL,
      role,
    } = formData;

    if (
      !firstName.trim() ||
      !middleName.trim() ||
      !lastName.trim() ||
      !age ||
      !sex ||
      !birthdate ||
      !civilStatus.trim() ||
      !occupation.trim() ||
      !contactNumber.trim() ||
      (!photo && !photoURL)
    ) {
      fireError('Oops...', 'Please fill all fields and upload a photo.');
      return;
    }

    if (userRole === 'resident') {
      if (currentResident) {
        fireError('Denied', 'You already registered. Please contact admin for updates.');
        return;
      }
      const newId = generateId();
      const newResident = {
        ...formData,
        id: newId,
        role: 'Resident',
      };
      setResidents((prev) => [...prev, newResident]);
      setCurrentUserIdState(newId);
      fireSuccess('Registered!', 'Your account has been created.');
      setShowModal(false);
      return;
    }

    if (id) {
      setResidents((prev) =>
        prev.map((res) => (res.id === id ? { ...formData } : res))
      );
      fireSuccess('Updated!', 'Resident updated.');
    } else {
      const newResident = { ...formData, id: generateId() };
      setResidents((prev) => [...prev, newResident]);
      fireSuccess('Added!', 'New resident added.');
    }
    setShowModal(false);
  };

  const handleDelete = (idx) => {
    fireConfirm('Are you sure?', 'This will remove the resident.').then((result) => {
      if (result.isConfirmed) {
        setResidents((prev) => prev.filter((_, i) => i !== idx));
        fireSuccess('Deleted', 'Resident removed.');

        if (residents[idx]?.id === currentUserIdState) {
          setCurrentUserIdState(null);
        }
      }
    });
  };

  if (userRole === 'resident') {
    if (!currentResident) {
      return (
        <div className={`container-fluid my-5 ${styles.bg}`}>
          <h2 className={`mb-4 ${styles['forest-green-text']}`}> Resident Registration </h2>
          <button
            className={`btn mb-3 ${styles['forest-green']}`}
            onClick={() => openModal()}
          >
            Register Your Account
          </button>

          {showModal && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={closeModal}
            >
              <div
                className="modal-dialog modal-lg"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content">
                  <form onSubmit={handleSubmit}>
                    <div className={`modal-header ${styles['forest-green']}`}>
                      <h5 className="modal-title text-white">Register Account</h5>
                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={closeModal}
                      ></button>
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
                        <label className="form-label">Age</label>
                        <input
                          type="number"
                          className="form-control"
                          name="age"
                          min="0"
                          max="120"
                          value={formData.age}
                          onChange={handleChange}
                          required
                          readOnly
                        />
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
                        <label className="form-label">Birthdate</label>
                        <input
                          type="date"
                          className="form-control"
                          name="birthdate"
                          value={formData.birthdate}
                          onChange={handleChange}
                          required
                        />
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

                      <div className="mb-3">
                        <label className="form-label">Occupation</label>
                        <input
                          type="text"
                          className="form-control"
                          name="occupation"
                          value={formData.occupation}
                          onChange={handleChange}
                          required
                        />
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
                          pattern="^\+?\d{7,15}$"
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
                            style={{
                              width: '150px',
                              height: '150px',
                              objectFit: 'cover',
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                      <button type="submit" className="btn btn-primary">
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

    return (
      <div className={`container my-5 ${styles.bg}`}>
        <h2 className={`mb-4 ${styles['forest-green-text']}`}> Resident Profile </h2>
        <div className="card p-4">
          <img
            src={currentResident.photoURL}
            alt="Resident"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'cover',
              borderRadius: '50%',
              cursor: 'pointer',
            }}
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

          {viewPhoto && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              role="dialog"
              style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
              onClick={() => setViewPhoto(null)}
            >
              <div
                className="modal-dialog"
                role="document"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content p-3">
                  <img
                    src={viewPhoto}
                    alt="Resident Large"
                    style={{ width: '100%', height: 'auto' }}
                  />
                  <button
                    className="btn btn-secondary mt-2"
                    onClick={() => setViewPhoto(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`container my-5 ${styles.bg}`}>
      <h2 className={`mb-4 ${styles['forest-green-text']}`}> Manage Residents </h2>
      <button className={`btn mb-3 ${styles['forest-green']}`} onClick={() => openModal()}>
        Add New Resident
      </button>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className={styles['forest-green']}>
            <tr className="text-white">
              <th>Photo</th>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Birthdate</th>
              <th>Civil Status</th>
              <th>Occupation</th>
              <th>Contact Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents.map((resident, idx) => (
              <tr key={resident.id}>
                <td>
                  <img
                    src={resident.photoURL}
                    alt="Photo"
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      cursor: 'pointer',
                    }}
                    onClick={() => setViewPhoto(resident.photoURL)}
                  />
                </td>
                <td>
                  {resident.firstName} {resident.middleName} {resident.lastName}
                </td>
                <td>{resident.age}</td>
                <td>{resident.sex}</td>
                <td>{resident.birthdate}</td>
                <td>{resident.civilStatus}</td>
                <td>{resident.occupation}</td>
                <td>{resident.contactNumber}</td>
                <td>{resident.role}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openModal(resident)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(idx)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={closeModal}
        >
          <div
            className="modal-dialog modal-lg"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className={`modal-header ${styles['forest-green']}`}>
                  <h5 className="modal-title text-white">
                    {formData.id ? 'Edit Resident' : 'Add Resident'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  ></button>
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
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      name="age"
                      min="0"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      readOnly
                    />
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
                    <label className="form-label">Birthdate</label>
                    <input
                      type="date"
                      className="form-control"
                      name="birthdate"
                      value={formData.birthdate}
                      onChange={handleChange}
                      required
                    />
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

                  <div className="mb-3">
                    <label className="form-label">Occupation</label>
                    <input
                      type="text"
                      className="form-control"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                    />
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
                      pattern="^\+?\d{7,15}$"
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
                    />
                    {formData.photoURL && (
                      <img
                        src={formData.photoURL}
                        alt="Preview"
                        className="mt-2 img-thumbnail"
                        style={{
                          width: '150px',
                          height: '150px',
                          objectFit: 'cover',
                        }}
                      />
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="Resident">Resident</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {formData.id ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {viewPhoto && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setViewPhoto(null)}
        >
          <div
            className="modal-dialog"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <img
                src={viewPhoto}
                alt="Resident Large"
                style={{ width: '100%', height: 'auto' }}
              />
              <button
                className="btn btn-secondary mt-2"
                onClick={() => setViewPhoto(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterResident;
