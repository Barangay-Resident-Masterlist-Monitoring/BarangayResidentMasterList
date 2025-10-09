import { useState } from 'react';
import background from '../css/login.module.css';
import color from '../css/login.module.css';

const GenerateReport = () => {
  const [reports, setReports] = useState([
    { id: 1, name: 'Resident Updates', date: '2025-10-09', status: 'Completed' },
    { id: 2, name: 'Pending Requests', date: '2025-10-08', status: 'Pending' },
  ]);
  const [search, setSearch] = useState('');

  const handleGenerate = () => {
    const newReport = {
      id: reports.length + 1,
      name: `Report ${reports.length + 1}`,
      date: new Date().toLocaleDateString(),
      status: 'Pending',
    };
    setReports([newReport, ...reports]);
    alert('New report generated successfully!');
  };

  const filteredReports = reports.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <h2 className={`text-center rounded-top p-3 ${color['forest-green']}`}>
           Generate Reports
        </h2>

        <div className="d-flex flex-wrap gap-3 p-3 align-items-center">
          <input
            type="text"
            placeholder="Search reports..."
            className="form-control"
            style={{ maxWidth: '300px', borderColor: color['forest-green'] }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        <div className="table-responsive p-3">
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
              {filteredReports.length > 0 ? (
                filteredReports.map((r) => (
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

     
        <div
          className="d-flex justify-content-center p-3"
        >
          <button
            className={`${color['forest-green']} btn btn-lg`}
            style={{ color: 'black' ,fontWeight: 'bold' }}
            onClick={handleGenerate}
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
