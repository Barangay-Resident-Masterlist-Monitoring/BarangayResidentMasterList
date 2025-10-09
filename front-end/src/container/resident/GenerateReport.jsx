import background from '../css/login.module.css';
import color from '../css/login.module.css';

const GenerateReports = () => {
  const reports = [
    { id: 1, name: 'Resident Updates', date: '2025-10-09', status: 'Completed' },
    { id: 2, name: 'Pending Requests', date: '2025-10-08', status: 'Pending' },
    { id: 3, name: 'Monthly Summary', date: '2025-10-01', status: 'Completed' },
  ];

  return (
    <div
      className={`${background['bg-1']} d-flex justify-content-center align-items-start py-5`}
      style={{ minHeight: '100vh' }}
    >
      <div
        className="shadow-lg"
        style={{
          backgroundColor: '#ffffffcc',
          maxWidth: '900px',
          width: '100%',
          borderRadius: '15px'
        }}
      >
        <h2 className={`text-center rounded-top p-3 ${color['forest-green']}`}>Reports</h2>

        <div className='table-responsive'>
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Report Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.date}</td>
                    <td>
                      <span
                        className={`badge ${
                          r.status === 'Completed'
                            ? `bg- ${color['forest-green']}`
                            : r.status === 'Pending'
                            ? 'bg-warning text-dark'
                            : 'bg-danger'
                        }`}
                        style={{ fontSize: '0.9rem', padding: '0.35em 0.7em' }}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted">
                    No reports available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="text-center mt-3 text-muted" style={{ fontSize: '0.9rem' }}>
          Reports are for viewing only.
        </p>
      </div>
    </div>
  );
};

export default GenerateReports;
