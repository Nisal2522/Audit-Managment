import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ContDashboard from './pages/food/Contractor/ContDashboard';
import ContractorFE from './pages/food/Contractor/ContractorFE';
import ContractCreation from './pages/food/Contractor/ContractCreation';  
import ContractStatus from './pages/food/Contractor/ContractStatus';
import UpdateContract from './pages/food/Contractor/UpdateContract';
import IncomeStatus from './pages/food/Contractor/IncomeStatus';
import TotIncome from './pages/food/Contractor/TotIncome';
import TotIncomeLKR from './pages/food/Contractor/TotIncomeLKR';

import Login from './pages/LoginPage';
// import AdminDashboard from './pages/AdminDashboard';
// import RegisterPage from './pages/RegisterPage';
// import AdminFood from './pages/food/Admin';
// import ReviewerFood from './pages/food/Reviewer';
// import CertifierFood from './pages/food/Certifier';
// import Certifierorganic from './pages/organic/Certifier';
// import ReviewerOrganic from './pages/organic/Reviewer';
// import AuditorOrganic from './pages/organic/Auditor';
// import ContractorOrganic from './pages/organic/Contractor';
// import PlannerOrganic from './pages/organic/Planner';
// import ProjectOrganic from './pages/organic/ProjectCreator';
// import DepartmentheadFood from './pages/food/DepartmentHead/DepartmentHead';
// import CreateprofileFood from './pages/food/DepartmentHead/Createprofile';
// import Activeaccountfood from './pages/food/DepartmentHead/Activemember';
// import EmployeeStatusFood from './pages/food/DepartmentHead/Employeestatus';
// import Requestleavefood from './pages/food/DepartmentHead/Requestleave';
// import ProfileHeadFood from './pages/food/DepartmentHead/Profile';
// import AnnouncementsFoodHead from './pages/food/DepartmentHead/Announcement';
// import Reportviewfoodhead from './pages/food/DepartmentHead/ReportVidew';

function App() {


  return (
    <BrowserRouter>


        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/" element={<ContDashboard />} />
          <Route path="/ContractorFE" element={<ContractorFE />} />
          <Route path="/ContractCreation" element={<ContractCreation />} />
          <Route path="/ContractStatus" element={<ContractStatus />} />
          <Route path="/UpdateContract/:id" element={<UpdateContract />} />
          <Route path="/IncomeStatus" element={<IncomeStatus />} />
          <Route path="/TotIncome" element={<TotIncome />} />
          <Route path="/TotIncomeLKR" element={<TotIncomeLKR />} />
          <Route path="/login" element={<Login />} />
           {/* <Route path="/" element={<RegisterPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/food/admin" element={<AdminFood />} />
          <Route path="/food/reviewer" element={<ReviewerFood />} />
          <Route path="/food/certifier" element={<CertifierFood />} />
          <Route path="/food/Head" element={<DepartmentheadFood/>}/>
          <Route path="/organic/Certifier" element={<Certifierorganic/>}/>
          <Route path="/organic/Reviewer" element={<ReviewerOrganic/>}/>
          <Route path="/organic/ProjectCreator" element={<ProjectOrganic/>}/>
          <Route path="/organic/Planner" element={<PlannerOrganic/>}/>
          <Route path="/organic/Contractor" element={<ContractorOrganic/>}/>
          <Route path="/organic/Auditor" element={<AuditorOrganic/>}/>
          <Route path="/food/Head/Createaccount" element={<CreateprofileFood/>}/>
          <Route path="/food/Head/ActiveMembers" element={<Activeaccountfood/>}/>
          <Route path="/food/Head/Employeestatus" element={<EmployeeStatusFood/>}/>
          <Route path="/food/Head/Requestleave" element={<Requestleavefood/>}/>
          <Route path="/food/Head/ProfileHeadFood" element={<ProfileHeadFood/>}/>
          <Route path="/food/Head/Announcement" element={<AnnouncementsFoodHead/>}/>
          <Route path="/food/Head/Reportview" element={<Reportviewfoodhead/>}/> */}
           
           
        </Routes>
    </BrowserRouter>
    
  );
}

export default App;
