import { useEffect, useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';
import useSweetAlert from '../hooks/useSweetAlert';
import color from '../css/login.module.css';
import background from '../css/login.module.css';

const RequestUpdate = ({ viewOnly = false }) => {
  const { fireSuccess, fireError } = useSweetAlert();
  const [fields, setFields] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    age: '',
    sex: '',
    birthdate: '',
    civilStatus: '',
    occupation: '',
    otherOccupation: '',
    contactNumber: ''
  });
  const [reason, setReason] = useState('');
  const [modifiedFields, setModifiedFields] = useState([]);
  const [showOtherOccupation, setShowOtherOccupation] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [userFound, setUserFound] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  const modFieldOptions = [
    { name: 'firstName', id: 'firstName' },
    { name: 'middleName', id: 'middleName' },
    { name: 'lastName', id: 'lastName' },
    { name: 'age', id: 'age' },
    { name: 'sex', id: 'sex' },
    { name: 'birthdate', id: 'birthdate' },
    { name: 'civilStatus', id: 'civilStatus' },
    { name: 'occupation', id: 'occupation' },
    { name: 'contactNumber', id: 'contactNumber' },
    { name: 'image', id: 'image' }
  ];

  useEffect(() => {
    const currUserId = localStorage.getItem('currentUserId');
    if (!currUserId) {
      fireError('Error', 'No current user id found.');
      return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => String(u.id) === String(currUserId));
    if (!user) {
      fireError('Error', 'User not found.');
      return;
    }
    setUserFound(true);

    setFields({
      firstName: user.firstName || '',
      middleName: user.middleName || '',
      lastName: user.lastName || '',
      age: user.age || '',
      sex: user.sex || '',
      birthdate: user.birthdate || '',
      civilStatus: user.civilStatus || '',
      occupation: user.occupation || '',
      otherOccupation: user.otherOccupation || '',
      contactNumber: user.contactNumber || ''
    });

    setShowOtherOccupation(
      user.occupation !== 'Student' &&
      user.occupation !== 'Retired' &&
      user.occupation !== ''
    );

    // check if there is a pending request for this user
    const requests = JSON.parse(localStorage.getItem('updateRequests')) || [];
    const pending = requests.some(r =>
      String(r.userId) === String(currUserId) &&
      r.status === 'pending'
    );
    setHasPendingRequest(pending);
  }, []);

  const handleFieldChange = (key, value) => {
    if (viewOnly || hasPendingRequest) return;
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = e => {
    if (viewOnly || hasPendingRequest) return;
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImageData(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!userFound) {
      fireError('Error', 'Cannot submit: user not found.');
      return;
    }
    if (hasPendingRequest) {
      fireError('Error', 'You already have a pending update request.');
      return;
    }
    if (modifiedFields.length === 0) {
      fireError('Error', 'Please select at least one field to modify.');
      return;
    }
    if (!reason.trim()) {
      fireError('Error', 'Please provide a reason for update.');
      return;
    }
    const currUserId = localStorage.getItem('currentUserId');
    const updateRequests = JSON.parse(localStorage.getItem('updateRequests')) || [];
    const modifiedIds = modifiedFields.map(f => f.id);
    const newRequest = {
      requestId: Date.now(),
      userId: String(currUserId),
      updatedFields: { ...fields },
      modifiedFields: modifiedIds,
      image: imageData,
      reason,
      status: 'pending',
      date: new Date().toLocaleString()
    };
    localStorage.setItem('updateRequests', JSON.stringify([...updateRequests, newRequest]));
    fireSuccess('Submitted', 'Update request submitted.');
    setReason('');
    setModifiedFields([]);
    setImageData(null);
    setHasPendingRequest(true);
  };

  return (
    <div style={{ minHeight: '100vh', margin: '0 50px 50px 50px' }}>
      <div className={`${background['bg-1']} d-flex justify-content-center`}>
        <div className="card shadow-lg"
          style={{ borderRadius: '15px', backgroundColor: '#ffffff', width: '100%' }}>
          <h3 className={`${color['forest-green']} mb-3 text-center rounded-top p-3`}>
            Update Request Form
          </h3>
          <div className="p-3">
            <div className="row g-2">
              {/* input fields */}
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fields.firstName}
                  onChange={e => handleFieldChange('firstName', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Middle Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fields.middleName}
                  onChange={e => handleFieldChange('middleName', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={fields.lastName}
                  onChange={e => handleFieldChange('lastName', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Age</label>
                <input
                  type="text"
                  className="form-control"
                  value={fields.age}
                  onChange={e => handleFieldChange('age', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Sex</label>
                <select
                  className="form-select"
                  value={fields.sex}
                  onChange={e => handleFieldChange('sex', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                >
                  <option value="">Select Sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Birthdate</label>
                <input
                  type="date"
                  className="form-control"
                  value={fields.birthdate}
                  onChange={e => handleFieldChange('birthdate', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Civil Status</label>
                <select
                  className="form-select"
                  value={fields.civilStatus}
                  onChange={e => handleFieldChange('civilStatus', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                >
                  <option value="">Select Civil Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Separated">Separated</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Occupation</label>
                <select
                  className="form-select"
                  value={showOtherOccupation ? 'Other' : fields.occupation}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'Other') {
                      setShowOtherOccupation(true);
                      handleFieldChange('occupation', '');
                    } else {
                      setShowOtherOccupation(false);
                      handleFieldChange('occupation', val);
                      handleFieldChange('otherOccupation', '');
                    }
                  }}
                  disabled={viewOnly || hasPendingRequest}
                >
                  <option value="">Select Occupation</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                  <option value="Other">Other</option>
                </select>
                {showOtherOccupation && (
                  <input
                    type="text"
                    className="form-control mt-2"
                    placeholder="Specify occupation"
                    value={fields.occupation}
                    onChange={e => handleFieldChange('occupation', e.target.value)}
                    disabled={viewOnly || hasPendingRequest}
                  />
                )}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={fields.contactNumber}
                  onChange={e => handleFieldChange('contactNumber', e.target.value)}
                  disabled={viewOnly || hasPendingRequest}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Upload Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={viewOnly || hasPendingRequest}
              />
              {imageData && (
                <img
                  src={imageData}
                  alt="Preview"
                  style={{ maxWidth: '200px', marginTop: '10px' }}
                />
              )}
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Which fields were modified?</label>
              <Multiselect
                options={modFieldOptions}
                selectedValues={modifiedFields}
                onSelect={setModifiedFields}
                onRemove={setModifiedFields}
                displayValue="name"
                showCheckbox
                disable={viewOnly || hasPendingRequest}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Reason for Update</label>
              <textarea
                className="form-control"
                rows={3}
                value={reason}
                onChange={e => setReason(e.target.value)}
                disabled={viewOnly || hasPendingRequest}
              />
            </div>

            {!viewOnly && (
              <button
                className="btn w-100"
                style={{ backgroundColor: color['forest-green'], color: '#fff', fontWeight: 'bold' }}
                onClick={handleSubmit}
                disabled={hasPendingRequest}
              >
                {hasPendingRequest ? 'Pending Request Exists' : 'Submit Request'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestUpdate;
