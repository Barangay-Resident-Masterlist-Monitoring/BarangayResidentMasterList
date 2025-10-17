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
  const usersJson = localStorage.getItem('users');
  const users = usersJson ? JSON.parse(usersJson) : [];
  const residentUsers = users.filter(u => u.role);

  const countBy = (field, ageBuckets = false) => {
    const counts = {};
    residentUsers.forEach(u => {
      let value = u[field];

      if (field === 'birthdate') {
        value = value ? new Date(value).toLocaleDateString() : null;
      }

      if (!value) value = 'Not yet registered';

      if (ageBuckets && field === 'age') {
        const age = parseInt(u.age, 10);
        if (!age) value = 'Not yet registered';
        else if (age <= 17) value = '1-17';
        else if (age <= 35) value = '18-35';
        else if (age <= 60) value = '36-60';
        else value = '60+';
      }

      counts[value] = (counts[value] || 0) + 1;
    });
    return counts;
  };

  const toData = (counts, label, colors) => {
    const labels = Object.keys(counts);
    const dataValues = Object.values(counts);
    return {
      labels,
      datasets: [
        {
          label,
          data: dataValues,
          backgroundColor: colors.slice(0, labels.length),
        },
      ],
    };
  };

  const sexData = toData(countBy('sex'), 'Population by Sex', ['#4A90E2', '#E94E77']);
  const ageData = toData(countBy('age', true), 'Population by Age Group', ['#F5A623', '#50E3C2', '#9013FE', '#F8E71C']);
  const civilStatusData = toData(countBy('civilStatus'), 'Civil Status', ['#4A90E2', '#E94E77', '#F5A623', '#7ED6DF']);
  const occupationData = toData(countBy('occupation'), 'Occupational Distribution', ['#E94E77', '#50E3C2', '#9013FE', '#F8E71C']);

  const fieldNames = ['age', 'sex', 'birthdate', 'civilStatus', 'occupation', 'contactNumber'];
  const completionLabels = ['Age', 'Sex', 'Birthdate', 'Civil Status', 'Occupation', 'Contact Number'];

  const completionCounts = fieldNames.map(field => {
    let completed = 0;
    let notCompleted = 0;

    residentUsers.forEach(u => {
      const value = u[field];
      const valid =
        field === 'birthdate' ? Boolean(value && new Date(value).toString() !== 'Invalid Date') : Boolean(value);

      if (valid) completed++;
      else notCompleted++;
    });

    return { completed, notCompleted };
  });

  const completionData = {
    labels: completionLabels,
    datasets: [
      {
        label: 'Completed',
        data: completionCounts.map(f => f.completed),
        backgroundColor: '#66BB6A',
      },
      {
        label: 'Not Yet Registered',
        data: completionCounts.map(f => f.notCompleted),
        backgroundColor: '#FFA726',
      },
    ],
  };

  const completionOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true },
    },
  };

  return (
    <div className={`${background['bg-1']}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="container flex-grow-1 py-5">
        <h2 className="mb-4 fw-semibold text-center" style={{ color: '#222' }}>
          Barangay Mabalanoy — Secretary Dashboard
        </h2>

        <div className="row g-3 mb-6">
          {[
            {
              title: 'Population by Sex',
              chart: <Pie data={sexData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />,
            },
            {
              title: 'Population by Age Group',
              chart: <Bar data={ageData} options={{ responsive: true, plugins: { legend: { display: false } } }} />,
            },
            {
              title: 'Civil Status Breakdown',
              chart: <Doughnut data={civilStatusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />,
            },
            {
              title: 'Occupational Distribution',
              chart: <Bar data={occupationData} options={{ responsive: true, plugins: { legend: { display: false } } }} />,
            },
            {
              title: 'Field Completion Status',
              chart: <Bar data={completionData} options={completionOptions} />,
            },
          ].map(({ title, chart }, idx) => (
            <div key={idx} className="col-12 col-md-4 col-sm-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body" style={{ minHeight: '320px', maxHeight: '420px' }}>
                  <h5 className="card-title fw-semibold mb-3" style={{ color: '#333' }}>
                    {title}
                  </h5>
                  {chart}
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="mb-5 mt-4">
          <h3 className="text-center mb-4 fw-semibold" style={{ color: '#222' }}>
            <FaInfoCircle className="me-2" /> How to Use the Resident Dashboard
          </h3>

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {[
              {
                icon: <FaChartPie color="#4A90E2" size={24} />,
                title: 'Dashboard Overview',
                desc: 'Quick summary of key community data like age, gender, jobs, and civil status—all shown in charts.',
              },
              {
                icon: <FaEye color="#4A90E2" size={24} />,
                title: 'Reading the Charts',
                desc: 'Hover or click on any chart to view detailed numbers. Data updates automatically when new info is added.',
              },
              {
                icon: <FaListAlt color="#4A90E2" size={24} />,
                title: 'Types of Charts',
                desc: 'We use bar charts for age and jobs, pie charts for gender, and doughnut charts for civil status.',
              },
              {
                icon: <FaCompass color="#4A90E2" size={24} />,
                title: 'Navigation Tips',
                desc: 'Use the side menu to switch between dashboard, profile, and other tools. Everything is one click away.',
              },
              {
                icon: <FaLock color="#4A90E2" size={24} />,
                title: 'Data Privacy',
                desc: 'Your data is private and protected. For any corrections, please contact your barangay office.',
              },
              {
                icon: <FaInfoCircle color="#4A90E2" size={24} />,
                title: 'Important Reminder',
                desc: '⚠️ You can only view the dashboard. Only authorized staff can make changes to the data.',
              },
            ].map((item, i) => (
              <div className="col" key={i}>
                <div className="card h-100 shadow-sm border-0" style={{ backgroundColor: '#f9f9f9' }}>
                  <div className="card-body d-flex">
                    <div className="me-3">{item.icon}</div>
                    <div>
                      <h6 className="fw-semibold mb-1" style={{ color: '#333' }}>
                        {item.title}
                      </h6>
                      <p className="mb-0" style={{ color: '#555', fontSize: '0.95rem' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>


      </div>
    </div>
  );
};

export default Dashboard;
