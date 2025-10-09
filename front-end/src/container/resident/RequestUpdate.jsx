import { useEffect, useState } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';

const FOREST_GREEN = '#228B22';

const RequestUpdate = ({ viewOnly = false }) => {
  const { fireSuccess, fireError } = useSweetAlert();
  const [user, setUser] = useState(null);
  const [reason, setReason] = useState('');
  const [fields, setFields] = useState({});
  const [requestStatus, setRequestStatus] = useState('pending');

  useEffect(() => {
    const stored = localStorage.getItem('secretary');
    const userType = sessionStorage.getItem('userType');
    const sessionID = sessionStorage.getItem('sessionID');

    const fieldKeys = [
      'firstName','middleName','lastName','age','sex','birthdate',
      'civilStatus','occupation','contactNumber'
    ];

    if (stored && userType && sessionID) {
      const data = JSON.parse(stored);
      if (userType === 'resident') {
        setUser(data[0]);
      }
      const initialFields = fieldKeys.reduce((acc, key) => ({ ...acc, [key]: data[0]?.[key] || '' }), {});
      setFields(initialFields);
    } else {
      const emptyFields = fieldKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {});
      setFields(emptyFields);
    }
  }, []);

  const handleFieldChange = (key, value) => {
    if (requestStatus === 'denied' || viewOnly) return;
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      fireError('Error', 'Please provide a valid reason.');
      return;
    }

    const requests = JSON.parse(localStorage.getItem('updateRequests') || '[]');
    const sessionID = sessionStorage.getItem('sessionID');

    requests.push({
      requestId: requests.length + 1,
      userId: Number(sessionID),
      updatedFields: fields,
      reason,
      status: 'pending',
      date: new Date().toLocaleString()
    });

    localStorage.setItem('updateRequests', JSON.stringify(requests));

    fireSuccess('Request Submitted', 'Your update request has been sent.');
    setRequestStatus('pending');
    setReason('');
  };

  const groups = {
    "Personal Info": ['firstName','middleName','lastName','age','sex','birthdate','civilStatus'],
    "Professional Info": ['occupation'],
    "Contact Info": ['contactNumber']
  };

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: '#f4f9f4', padding: '10px' }}
    >
      <div className="container-fluid d-flex justify-content-center">
        <div
          className="card shadow-lg p-4"
          style={{ 
            borderRadius: '15px', 
            backgroundColor: '#ffffff',
            width: '100%',
            maxWidth: '600px',
            minWidth: '230px'
          }}
        >
          <h3 style={{ color: FOREST_GREEN }} className="mb-3 text-center">
            Update Request Form
          </h3>
          <p className="text-center">
            Status: 
            <strong style={{ 
              color: requestStatus==='denied' ? 'red' : requestStatus==='approved' ? FOREST_GREEN : '#FFA500',
              marginLeft: '5px'
            }}>
              {requestStatus.toUpperCase()}
            </strong>
          </p>

          {Object.keys(groups).map((groupName) => (
            <div key={groupName} className="mb-4">
              <h5 style={{ color: FOREST_GREEN }} className="mb-3">{groupName}</h5>
              <div className="row g-2">
                {groups[groupName].map((key) => (
                  <div key={key} className="col-12 col-sm-6">
                    <label className="form-label fw-bold">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={fields[key]}
                      onChange={(e) => handleFieldChange(key, e.target.value)}
                      disabled={requestStatus==='denied' || viewOnly}
                      style={{ borderColor: FOREST_GREEN, width: '100%' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-3 mt-3">
            <label className="form-label fw-bold">Reason for Update</label>
            <textarea
              className="form-control"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={requestStatus==='denied' || viewOnly}
              style={{ borderColor: FOREST_GREEN, width: '100%' }}
            />
          </div>

          {!viewOnly && requestStatus !== 'denied' && (
            <button 
              className="btn w-100"
              style={{ backgroundColor: FOREST_GREEN, color: '#fff', fontWeight: 'bold' }}
              onClick={handleSubmit}
            >
              Submit Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestUpdate;
