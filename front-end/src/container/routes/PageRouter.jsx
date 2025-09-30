
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";


import Resident from "../resident/main.jsx";
import Secretary from "../secretary/main.jsx";



import ResidentLogin from "../resident/login.jsx";
import SecretaryLogin from "../secretary/login.jsx";

import SecretaryDashboard from "../secretary/dashboard.jsx";
import ResidentDashboard from "../resident/dashboard.jsx";


const PageRouter = () => {
  return (
      <Router>
        <Routes>
          <Route path="/*" element={<Navigate to="/resident/login" />} />
          <Route path="/resident/login" element={<ResidentLogin/>} /> 
          <Route path="/secretary/login" element={<SecretaryLogin/>} />

          <Route 
            exact path="/resident"
            element={ <Resident /> }>
                <Route path="dashboard" element={<ResidentDashboard />} />
            </Route>

          <Route 
           exact path="/secretary"
            element={<Secretary />}>
                <Route path="dashboard" element={<SecretaryDashboard />} />
            </Route>
        </Routes>
      </Router>
  )
}

export default PageRouter