import { useState, useEffect, useRef } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';
import styles from '../css/login.module.css';

const ManageUser = () => {
  const { fireSuccess, fireError, fireConfirm } = useSweetAlert();

  const [residents, setResidents] = useState(() => {
    const stored = localStorage.getItem('secretary');
    return stored ? JSON.parse(stored) : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [viewPhoto, setViewPhoto] = useState(null);
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

  const hasLoaded = useRef(true);

  useEffect(() => {
    if (hasLoaded.current) {
      localStorage.setItem('secretary', JSON.stringify(residents));
    }
  }, [residents]);

  const generateId = () => Math.floor(Math.random() * 100000);

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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
      const photoURL = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, photo: file, photoURL }));
    } else if (name === 'birthdate') {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, birthdate: value, age }));
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

    if (id) {
      setResidents((prev) =>
        prev.map((res) => (res.id === id ? { ...formData } : res))
      );
      fireSuccess('Updated!', 'Resident updated.');
    } else {
      const newResident = {
        ...formData,
        id: generateId(),
      };
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
      }
    });
  };

  const filteredResidents = residents.filter((res) => {
    const fullName = `${res.firstName} ${res.middleName} ${res.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      res.age.toString().includes(search) ||
      res.sex.toLowerCase().includes(search) ||
      res.birthdate.toLowerCase().includes(search) ||
      res.civilStatus.toLowerCase().includes(search) ||
      res.occupation.toLowerCase().includes(search) ||
      res.contactNumber.toLowerCase().includes(search) ||
      res.role.toLowerCase().includes(search)
    );
  });

  return (
    <div className={`container my-5 ${styles.bg}`}>
      <h2 className={`mb-4 ${styles['forest-green-text']}`}>Residents and Officials</h2>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <button className={`btn ${styles['forest-green']}`} onClick={() => openModal()}>
          + Add New Resident/Official
        </button>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: '300px' }}
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className={`${styles['forest-green']} text-white`}>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Birthdate</th>
              <th>Civil Status</th>
              <th>Occupation</th>
              <th>Contact Number</th>
              <th>Role</th>
              <th>Photo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center">
                  No residents found.
                </td>
              </tr>
            ) : (
              filteredResidents.map((resident, idx) => (
                <tr key={resident.id}>
                  <td>{resident.id}</td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '180px' }}>
                      {`${resident.firstName} ${resident.middleName} ${resident.lastName}`}
                    </div>
                  </td>
                  <td>{resident.age}</td>
                  <td>{resident.sex}</td>
                  <td>{resident.birthdate}</td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '120px' }}>
                      {resident.civilStatus}
                    </div>
                  </td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '140px' }}>
                      {resident.occupation}
                    </div>
                  </td>
                  <td>
                    <div className="text-truncate" style={{ maxWidth: '140px' }}>
                      {resident.contactNumber}
                    </div>
                  </td>
                  <td>{resident.role}</td>
                  <td className="text-center">
                    {resident.photoURL ? (
                      <img
                        src={resident.photoURL}
                        alt={resident.firstName}
                        className="img-thumbnail"
                        style={{ maxWidth: '60px', maxHeight: '60px', objectFit: 'cover' }}
                      />
                    ) : (
                      'No photo'
                    )}
                  </td>
                  <td>
                    <a
                      href="#"
                      className="btn btn-sm btn-link text-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        setViewPhoto(resident);
                      }}
                      style={{ textDecoration: 'underline' }}
                    >
                      View Photo
                    </a>
                    <button
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => openModal(resident)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(residents.indexOf(resident))}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
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
                    {formData.id ? 'Edit Resident / Official' : 'Add Resident / Official'}
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
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="Resident">Resident</option>
                      <option value="Secretary">Secretary</option>
                    </select>
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
                          borderRadius: '8px',
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {formData.id ? 'Update' : 'Add'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>
                    Cancel
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
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onClick={() => setViewPhoto(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">
                  {viewPhoto.firstName} {viewPhoto.middleName} {viewPhoto.lastName}'s Photo
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewPhoto(null)}
                ></button>
              </div>
              <div className="modal-body text-center">
                {viewPhoto.photoURL ? (
                  <img
                    src={viewPhoto.photoURL}
                    alt={`${viewPhoto.firstName} ${viewPhoto.lastName}`}
                    style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px' }}
                  />
                ) : (
                  <p>No photo available.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
