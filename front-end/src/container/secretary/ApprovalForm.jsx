import { useEffect, useState } from 'react';
import useSweetAlert from '../hooks/useSweetAlert';
import color from '../css/login.module.css';
import background from '../css/login.module.css';

const ApprovalForm = () => {
  const { fireSuccess, fireError } = useSweetAlert();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('updateRequests')) || [];
    setRequests(stored);
  }, []);

  const handleStatusUpdate = (requestId, status) => {
    const req = requests.find(r => r.requestId === requestId);
    if (!req) {
      fireError('Error', 'Request not found.');
      return;
    }

    if (status === 'approved') {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.map(u => {
        if (String(u.id) === String(req.userId)) {
          const newUser = { ...u };
          req.modifiedFields.forEach(field => {
            if (field === 'image') {
              newUser.photoURL = req.image || newUser.photoURL;
            } else if (field === 'occupation') {
              // Handle occupation + otherOccupation fields
              newUser.occupation = req.updatedFields.occupation || newUser.occupation;
              newUser.otherOccupation = req.updatedFields.otherOccupation || '';
            } else {
              newUser[field] = req.updatedFields[field];
            }
          });
          return newUser;
        }
        return u;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    const updatedRequests = requests.map(r =>
      r.requestId === requestId ? { ...r, status } : r
    );
    setRequests(updatedRequests);
    localStorage.setItem('updateRequests', JSON.stringify(updatedRequests));

    const sec = JSON.parse(localStorage.getItem('secretary')) || {};
    const notifications = sec.notifications || [];
    notifications.push({
      message: `Request ${requestId} has been ${status.toUpperCase()}`,
      timestamp: new Date().toLocaleString()
    });
    localStorage.setItem('secretary', JSON.stringify({ ...sec, notifications }));

    fireSuccess('Updated', `Request ${requestId} marked as ${status}`);
  };

  return (
    <div style={{ minHeight: '100vh', margin: '0 50px 50px 50px' }}>
      <div className={`${background['bg-1']} d-flex justify-content-center`}>
        <div className="card shadow-lg" style={{ borderRadius: '15px', backgroundColor: '#fff', width: '100%' }}>
          <h3 className={`${color['forest-green']} mb-3 text-center rounded-top p-3`}>Update Requests</h3>
          <div className="table-responsive p-3">
            <table className="table table-bordered table-hover">
              <thead className="table-success text-center">
                <tr>
                  <th>Request ID</th>
                  <th>User ID</th>
                  <th>Modified Fields</th>
                  <th>Reason</th>
                  <th>Date</th>
                  <th>Image</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">No update requests found.</td>
                  </tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.requestId}>
                      <td>{req.requestId}</td>
                      <td>{req.userId}</td>
                      <td>
                        {req.modifiedFields.length > 0 ? (
                          <ul className="mb-0">
                            {req.modifiedFields.map(field => (
                              <li key={field}>
                                <strong>{field}</strong>:{' '}
                                {field === 'image' ? 'Image Updated' : req.updatedFields[field]}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          'None'
                        )}
                      </td>
                      <td>{req.reason}</td>
                      <td>{req.date}</td>
                      <td>
                        {req.image ? (
                          <img src={req.image} alt="Uploaded" style={{ maxWidth: '100px' }} />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className={`text-center ${req.status === 'approved' ? 'text-success' : req.status === 'rejected' ? 'text-danger' : ''}`}>
                        {req.status}
                      </td>
                      <td className="text-center">
                        {req.status === 'pending' && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleStatusUpdate(req.requestId, 'approved')}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleStatusUpdate(req.requestId, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {(req.status === 'approved' || req.status === 'rejected') && (
                          <span>No actions</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalForm;
