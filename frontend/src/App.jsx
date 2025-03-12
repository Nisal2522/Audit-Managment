import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/RegisterPage';
import AdminFood from './pages/food/Admin';
import ReviewerFood from './pages/food/Reviewer';
import CertifierFood from './pages/food/Certifier';
import Certifierorganic from './pages/organic/Certifier';
import ReviewerOrganic from './pages/organic/Reviewer';
import AuditorOrganic from './pages/organic/Auditor';
import ContractorOrganic from './pages/organic/Contractor';
import PlannerOrganic from './pages/organic/Planner';
import ProjectOrganic from './pages/organic/ProjectCreator';
import DepartmentheadFood from './pages/food/DepartmentHead/DepartmentHead';
import CreateprofileFood from './pages/food/DepartmentHead/Createprofile';
import Activeaccountfood from './pages/food/DepartmentHead/Activemember';
import EmployeeStatusFood from './pages/food/DepartmentHead/Employeestatus';
import Requestleavefood from './pages/food/DepartmentHead/Requestleave';
import ProfileHeadFood from './pages/food/DepartmentHead/Profile';
import AnnouncementsFoodHead from './pages/food/DepartmentHead/Announcement';
import Reportviewfoodhead from './pages/food/DepartmentHead/ReportVidew';
import ProjectCreatorDash from './pages/food/Project-Creator/Dashboard';

function App() {


  return (
    <BrowserRouter>
      <div className="App">
        {/* Tailwind-styled blue-screen header */}
        {(location.pathname === '/' || location.pathname === '/login') && (
          <div className="bg-blue-700 text-white w-full h-16 fixed top-0 z-50 flex items-center justify-center text-2xl font-bold shadow-lg">
            Audit Planning System
          </div>
        )}

        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/projectCreator" element={<ProjectCreatorDash />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/food/admin" element={<AdminFood />} />
          <Route path="/food/reviewer" element={<ReviewerFood />} />
          <Route path="/food/certifier" element={<CertifierFood />} />
          <Route path="/food/Head" element={<DepartmentheadFood />} />
          <Route path="/organic/Certifier" element={<Certifierorganic />} />
          <Route path="/organic/Reviewer" element={<ReviewerOrganic />} />
          <Route path="/organic/ProjectCreator" element={<ProjectOrganic />} />
          <Route path="/organic/Planner" element={<PlannerOrganic />} />
          <Route path="/organic/Contractor" element={<ContractorOrganic />} />
          <Route path="/organic/Auditor" element={<AuditorOrganic />} />
          <Route path="/food/Head/Createaccount" element={<CreateprofileFood />} />
          <Route path="/food/Head/ActiveMembers" element={<Activeaccountfood />} />
          <Route path="/food/Head/Employeestatus" element={<EmployeeStatusFood />} />
          <Route path="/food/Head/Requestleave" element={<Requestleavefood />} />
          <Route path="/food/Head/ProfileHeadFood" element={<ProfileHeadFood />} />
          <Route path="/food/Head/Announcement" element={<AnnouncementsFoodHead />} />
          <Route path="/food/Head/Reportview" element={<Reportviewfoodhead />} />


        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
