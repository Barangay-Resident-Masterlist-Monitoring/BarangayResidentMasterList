import { useState, useEffect } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';

const RequestUpdate = () => {
  const { fireSuccess, fireError } = useSweetAlert();
  const [user, setUser] = useState(null);
  const [reason, setReason] = useState('');
  const [highlightedFields, setHighlightedFields] = useState({});
  const [requestStatus, setRequestStatus] = useState('pending');

  useEffect(() => {
    const stored = localStorage.getItem('secretary');
    if (stored) {
      const data = JSON.parse(stored);
      if (Array.isArray(data) && data.length > 0) {
        setUser(data[0]);
        const fields = Object.keys(data[0]).filter(k =>
          ['firstName','middleName','lastName','age','sex','birthdate','civilStatus','occupation','contactNumber'].includes(k)
        ).reduce((acc, key) => ({ ...acc, [key]: false }), {});
        setHighlightedFields(fields);
      }
    }
  }, []);

  if (!user) return null;

  const handleFieldToggle = (field) => {
    if (requestStatus === 'denied') return;
    setHighlightedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    if (!reason.trim()) {
      fireError('Error', 'Please provide a valid reason.');
      return;
    }
    fireSuccess('Request Submitted', 'Your update request has been sent.');
    setRequestStatus('pending');
    const requests = JSON.parse(localStorage.getItem('updateRequests') || '[]');
    requests.push({ userId: user.id, highlightedFields, reason, status: 'pending' });
    localStorage.setItem('updateRequests', JSON.stringify(requests));
  };

  return (
    <div className="container my-5">
      <h3 className="text-success mb-3">Update Request Form</h3>
      <p>Status: <strong className={`text-${requestStatus==='denied'?'danger':requestStatus==='approved'?'success':'warning'}`}>{requestStatus.toUpperCase()}</strong></p>
      <div className="card shadow-sm p-4">
        {Object.keys(highlightedFields).map(field => (
          <div key={field} className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={highlightedFields[field]}
              onChange={() => handleFieldToggle(field)}
              disabled={requestStatus==='denied'}
            />
            <label className={`form-check-label ${highlightedFields[field] ? 'text-success fw-bold' : ''}`}>
              {field}: {user[field]}
            </label>
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Reason for Update</label>
          <textarea
            className="form-control"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={requestStatus==='denied'}
          />
        </div>

        <button className="btn btn-success" onClick={handleSubmit} disabled={requestStatus==='denied'}>Submit Request</button>
      </div>
    </div>
  );
};

export default RequestUpdate;
