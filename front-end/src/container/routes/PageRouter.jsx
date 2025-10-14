import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProfileView from "../components/ProfileView.jsx";

import Resident from "../resident/main.jsx";
import ResidentLogin from "../resident/login.jsx";
import ResidentDashboard from "../resident/dashboard.jsx";
import RegisterResidents from "../resident/RegisterResident.jsx";
import GenerateReports from "../resident/GenerateReport.jsx";
import RequestUpdate from "../resident/RequestUpdate.jsx";

import Secretary from "../secretary/main.jsx";
import SecretaryLogin from "../secretary/login.jsx";
import SecretaryDashboard from "../secretary/dashboard.jsx";
import ApprovalForm from "../secretary/ApprovalForm.jsx";
import ManageResidentsAndOfficial from "../secretary/ManagerUser.jsx"; 
import GenerateReportsForSecretary from "../secretary/GenerateReport.jsx";

const PageRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/resident/login" element={<ResidentLogin />} />
        <Route path="/secretary/login" element={<SecretaryLogin />} />

        <Route path="/resident" element={<Resident />}>
          <Route path="profile-view" element={<ProfileView />} />
          <Route path="dashboard" element={<ResidentDashboard />} />

          <Route path="request-update" element={<RequestUpdate />} />
          <Route path="register-residents" element={<RegisterResidents />} />
          <Route path="generate-report" element={<GenerateReports />} />

        </Route>

        <Route path="/secretary" element={<Secretary />}>
          <Route path="profile-view" element={<ProfileView />} />
          <Route path="dashboard" element={<SecretaryDashboard />} />

          <Route path="approval-form" element={<ApprovalForm />} />
          <Route path="manage-residents" element={<ManageResidentsAndOfficial />} />
          <Route path="generate-report" element={<GenerateReportsForSecretary />} />
  
        </Route>

        <Route path="*" element={<Navigate to="/resident/login" replace />} />
      </Routes>
    </Router>
  );
};

export default PageRouter;
