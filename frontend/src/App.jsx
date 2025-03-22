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

function App() {


  return (
    <BrowserRouter>
    <div className="App">
    

        <Routes>
          <Route path="/" element={<RegisterPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/food/Head" element={<DepartmentheadFood/>}/>
          <Route path="/food/Head/Createaccount" element={<CreateprofileFood/>}/>
          <Route path="/food/Head/Employeestatus" element={<EmployeeStatusFood/>}/>
          <Route path="/food/Head/Requestleave" element={<Requestleavefood/>}/>
          <Route path="/food/Head/ProfileHeadFood" element={<ProfileHeadFood/>}/>
          <Route path="/food/Head/Announcement" element={<AnnouncementsFoodHead/>}/>
          <Route path="/food/Head/Reportview" element={<Reportviewfoodhead/>}/>
           
           
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
