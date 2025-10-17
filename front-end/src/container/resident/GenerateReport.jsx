
import { useState, useEffect, useRef } from 'react';
import background from '../css/login.module.css';
import color from '../css/login.module.css';
import style from '../css/generateReport.module.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const GenerateReport = () => {
  const [residents, setResidents] = useState([]);
  const tableRef = useRef();

  useEffect(() => {
    const usersData = JSON.parse(localStorage.getItem('users')) || [];
    const residentUsers = usersData.filter((user) => user.role === 'Resident');
    setResidents(residentUsers);
  }, []);

  const generatePDF = () => {
    const input = tableRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('ResidentReport.pdf');
    });
  };

  return (
    <div className={`${background['bg-1']} d-flex justify-content-center align-items-start py-5 min-vh-100`}>
      <div className="shadow-lg bg-white bg-opacity-75 rounded-3 w-100 text-nowrap" style={{ maxWidth: '700px' }}>
        <h2 className={`text-center rounded-top p-3 ${color['forest-green']}`}>Resident Reports</h2>

        <div className="d-flex flex-column align-items-center gap-3 px-3 mb-3">
          <div className={`${style.reportWrapper}`}>
            <div className={`table-responsive ${style.reportContainer}`} ref={tableRef}>
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>#</th>
                    <th>First Name</th>
                    <th>Middle Name</th>
                    <th>Last Name</th>
                    <th>Age</th>
                    <th>Sex</th>
                    <th>Birthdate</th>

                  </tr>
                </thead>
                <tbody>
                  {residents.length > 0 ? (
                    residents.map((r, index) => (
                      <tr key={r.id}>
                        <td>{index + 1}</td>
                        <td>{r.firstName ?? '--'}</td>
                        <td>{r.middleName ?? '--'}</td>
                        <td>{r.lastName ?? '--'}</td>
                        <td>{r.age ?? '--'}</td>
                        <td>{r.sex ?? '--'}</td>
                        <td>{r.birthdate ?? '--'}</td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center text-muted">
                        No resident data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <button onClick={generatePDF} className="btn btn-success w-auto">
            Generate PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerateReport;
