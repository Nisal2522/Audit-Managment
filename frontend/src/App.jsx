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
import Systemadminprofile from './pages/Admin/Adminprofile';
import Systemadmincreateaccount from './pages/Admin/AdminCreateAccount';
import Resetpasswordadmin from './pages/Admin/resetpassword';
import Manageaccountsadmin from './pages/Admin/Manageaccounts';
import ProtectedRoute from './Components/ProtectedRoute'; 

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/register" element={
            <ProtectedRoute>
              <RegisterPage />
            </ProtectedRoute>
          } />


          <Route path="/food/Head" element={
            <ProtectedRoute>
              <DepartmentheadFood />
            </ProtectedRoute>
          } />

         
          <Route path="/food/Head/Createaccount" element={
            <ProtectedRoute>
              <CreateprofileFood />
            </ProtectedRoute>
          } />

          <Route path="/food/Head/Employeestatus" element={
            <ProtectedRoute>
              <EmployeeStatusFood />
            </ProtectedRoute>
          } />

          <Route path="/food/Head/Requestleave" element={
            <ProtectedRoute>
              <Requestleavefood />
            </ProtectedRoute>
          } />

          <Route path="/food/Head/Profile" element={
            <ProtectedRoute>
              <ProfileHeadFood />
            </ProtectedRoute>
          } />

          <Route path="/food/Head/Announcement" element={
            <ProtectedRoute>
              <AnnouncementsFoodHead />
            </ProtectedRoute>
          } />

          <Route path="/food/Head/Reportview" element={
            <ProtectedRoute>
              <Reportviewfoodhead />
            </ProtectedRoute>
          } />

          <Route path="/Admin" element={
            <ProtectedRoute>
              <Systemadmin />
            </ProtectedRoute>
          } />

          <Route path="/Admin/profile" element={
            <ProtectedRoute>
              <Systemadminprofile />
            </ProtectedRoute>
          } />

          <Route path="/Admin/create-account" element={
            <ProtectedRoute>
              <Systemadmincreateaccount />
            </ProtectedRoute>
          } />

          <Route path="/Admin/Reset-Password" element={
            <ProtectedRoute>
              <Resetpasswordadmin />
            </ProtectedRoute>
          } />

          <Route path="/Admin/manage-accounts" element={
            <ProtectedRoute>
              <Manageaccountsadmin />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;