
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";



import Resident from "../resident/main.jsx";
import ResidentLogin from "../resident/login.jsx";
import ResidentDashboard from "../resident/dashboard.jsx";
import RegisterResidents from "../resident/RegisterResident.jsx";
import GenerateReports from "../resident/generate_reports.jsx";


import Secretary from "../secretary/main.jsx";
import SecretaryLogin from "../secretary/login.jsx";
import SecretaryDashboard from "../secretary/dashboard.jsx";
import ManageResidentsAndOfficial from "../secretary/ManagerUser.jsx"; 


const PageRouter = () => {
  return (
      <Router>
        <Routes>
         <Route path="/resident/login" element={<ResidentLogin />} />
          <Route path="/secretary/login" element={<SecretaryLogin />} />
          <Route path="/*" element={<Navigate to="/resident/login" />} />


          <Route 
            exact path="/resident"
            element={ <Resident /> }>
                <Route path="dashboard" element={<ResidentDashboard  />} />
                <Route path="register-residents" element={<RegisterResidents  />} />
                <Route path="generate-report" element={<GenerateReports  />} />
            </Route>

          <Route 
           exact path="/secretary"
            element={<Secretary />}>
                <Route path="dashboard" element={<SecretaryDashboard />} />
                <Route path="manage-residents" element={<ManageResidentsAndOfficial/>} />
            </Route>
        </Routes>
      </Router>
  )
}

export default PageRouter