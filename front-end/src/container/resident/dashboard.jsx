import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import background from '../css/login.module.css';

import { FaChartPie, FaEye, FaListAlt, FaCompass, FaLock, FaInfoCircle } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const Dashboard = () => {
  const sexData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Population by Sex',
        data: [600, 720],
        backgroundColor: ['#4A90E2', '#E94E77'],
      },
    ],
  };

  const ageGroupData = {
    labels: ['0-17', '18-35', '36-60', '60+'],
    datasets: [
      {
        label: 'Population by Age Group',
        data: [150, 400, 500, 270],
        backgroundColor: ['#F5A623', '#50E3C2', '#9013FE', '#F8E71C'],
      },
    ],
  };

  const civilStatusData = {
    labels: ['Single', 'Married', 'Widowed', 'Divorced'],
    datasets: [
      {
        label: 'Civil Status',
        data: [550, 600, 90, 80],
        backgroundColor: ['#4A90E2', '#E94E77', '#F5A623', '#7ED6DF'],
      },
    ],
  };

  const occupationData = {
    labels: ['Student', 'Employed', 'Unemployed', 'Retired'],
    datasets: [
      {
        label: 'Occupational Distribution',
        data: [300, 700, 150, 120],
        backgroundColor: ['#E94E77', '#50E3C2', '#9013FE', '#F8E71C'],
      },
    ],
  };

  return (
    <div className={`${background['bg-1']} py-5`}>
      <div className="container">

        <h2 className="mb-4 fw-semibold text-center" style={{ color: '#222' }}>
          Barangay Mabalanoy - Resident Demographics Dashboard
        </h2>

        <div className="row g-3 mb-6">
          {[{
            title: 'Population by Sex',
            chart: <Pie data={sexData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          },{
            title: 'Population by Age Group',
            chart: <Bar data={ageGroupData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          },{
            title: 'Civil Status Breakdown',
            chart: <Doughnut data={civilStatusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          },{
            title: 'Occupational Distribution',
            chart: <Bar data={occupationData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          }].map(({title, chart}, idx) => (
            <div key={idx} className="col-12 col-md-3 col-sm-6">
              <div className="card border-0 shadow-sm">
                <div className="card-body" style={{ minHeight: '320px', maxHeight: '420px' }}>
                  <h5 className="card-title fw-semibold mb-3" style={{ color: '#333' }}>{title}</h5>
                  {chart}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mb-5 mt-4">
          <h3 className="text-center mb-4 fw-semibold" style={{ color: '#222' }}>
            <FaInfoCircle className="me-2" /> System Usage Guide for Residents
          </h3>
          <div className="table-responsive">
            <table className="table align-middle mb-0" style={{ borderCollapse: 'separate', borderSpacing: '0 0.75rem' }}>
              <thead>
                <tr>
                  <th style={{ width: '50px' }} className="text-center text-muted">Icon</th>
                  <th className="text-muted" style={{ width: '180px' }}>Section</th>
                  <th className="text-muted">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    icon: <FaChartPie color="#4A90E2" size={20} />,
                    title: 'Dashboard Overview',
                    desc: 'Visual summary of demographic data with charts for population by sex, age, occupation, and civil status.'
                  },
                  {
                    icon: <FaEye color="#4A90E2" size={20} />,
                    title: 'Viewing Demographic Charts',
                    desc: 'Hover or tap chart segments to view values. Charts update automatically with latest data. Report discrepancies to barangay officials.'
                  },
                  {
                    icon: <FaListAlt color="#4A90E2" size={20} />,
                    title: 'Types of Charts',
                    desc: 'Pie chart for sex, bar charts for age and occupation, doughnut chart for civil status breakdown.'
                  },
                  {
                    icon: <FaCompass color="#4A90E2" size={20} />,
                    title: 'Navigation Tips',
                    desc: 'Use sidebar/top menu for Dashboard, Profile, Notifications. Click bell icon for updates. Profile icon to logout or settings.'
                  },
                  {
                    icon: <FaLock color="#4A90E2" size={20} />,
                    title: 'Data Privacy & Accuracy',
                    desc: 'Data is confidential. Residents can request corrections that require barangay approval.'
                  },
                  {
                    icon: <FaInfoCircle color="#4A90E2" size={20} />,
                    title: 'Important Note',
                    desc: '⚠️ View-only system for residents. Editing requires barangay official authorization.'
                  },
                ].map(({ icon, title, desc }, i) => (
                  <tr key={i} style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <td className="text-center">{icon}</td>
                    <td className="fw-semibold" style={{ color: '#333' }}>{title}</td>
                    <td style={{ color: '#555' }}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;
