import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DepartmentheadFood from './pages/food/DepartmentHead/DepartmentHead';
import CreateprofileFood from './pages/food/DepartmentHead/Createprofile';
import EmployeeStatusFood from './pages/food/DepartmentHead/Employeestatus';
import Requestleavefood from './pages/food/DepartmentHead/Requestleave';
import ProfileHeadFood from './pages/food/DepartmentHead/Profile';
import AnnouncementsFoodHead from './pages/food/DepartmentHead/Announcement';
import Reportviewfoodhead from './pages/food/DepartmentHead/ReportVidew';
import Systemadmin from './pages/Admin/Admin';
import Systemadmincreateaccount from './pages/Admin/AdminCreateAccount';
import Systemadminprofile from './pages/Admin/Adminprofile';
import Manageaccountsadmin from './pages/Admin/Manageaccounts';
import Resetpasswordadmin from './pages/Admin/resetpassword';

function App() {


  return (
    <BrowserRouter>
    <div className="App">
    

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registerpage" element={<RegisterPage/>} />
          <Route path="/food/Head" element={<DepartmentheadFood/>}/>
          <Route path="/food/Head/Createaccount" element={<CreateprofileFood/>}/>
          <Route path="/food/Head/Employeestatus" element={<EmployeeStatusFood/>}/>
          <Route path="/food/Head/Requestleave" element={<Requestleavefood/>}/>
          <Route path="/food/Head/Profile" element={<ProfileHeadFood/>}/>
          <Route path="/food/Head/Announcement" element={<AnnouncementsFoodHead/>}/>
          <Route path="/food/Head/Reportview" element={<Reportviewfoodhead/>}/>
          <Route path="/Admin" element={<Systemadmin />} />
          <Route path="/Admin/create-account" element={<Systemadmincreateaccount />} />
          <Route path="/Admin/profile" element={<Systemadminprofile />} />
          <Route path="/Admin/manage-accounts" element={<Manageaccountsadmin />} />
          <Route path="/Admin/Reset-Password" element={<Resetpasswordadmin />} />

        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
