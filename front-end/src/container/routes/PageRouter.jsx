
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";


import Resident from "../resident/main.jsx";
import Secretary from "../secretary/main.jsx";



import SecretaryLogin from "../secretary/login.jsx";
import ResidentLogin from "../resident/login.jsx";

import SecretaryDashboard from "../secretary/dashboard.jsx";
import ResidentDashboard from "../resident/dashboard.jsx";

import SAMPLELANG from "../resident/main.jsx";

const PageRouter = () => {
  return (
      <Router>
        <Routes>
          <Route path="resident/login" element={< ResidentLogin/>} />
          <Route path="secretary/login" element={< SecretaryLogin/>} />
             

           /*-- -- -- -- temporary langsss -- -- -- --*/
          <Route path="/" element={<SAMPLELANG/>} /> 
          {/* <Route path="/" element={<Navigate to="/resident/login" />} /> */}

          <Route 
            exact path="/resident"
            element={ <Resident /> }>
                <Route path="dashboard" element={<ResidentDashboard type="resident" />} />
            </Route>

          <Route 
           exact path="/secretary"
            element={<Secretary />}>
                <Route path="dashboard" element={<SecretaryDashboard type="secretary" />} />
            </Route>
        </Routes>
      </Router>
  )
}

export default PageRouter