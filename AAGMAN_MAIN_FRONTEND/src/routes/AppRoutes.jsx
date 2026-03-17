import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/common/ProtectedRoute';
import PublicRoute from '../components/common/PublicRoute';
import Navbar from '../components/layout/Navbar';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import RegisterStudent from '../pages/auth/RegisterStudent';
import RegisterDepartment from '../pages/auth/RegisterDepartment';
import RegisterAcademic from '../pages/auth/RegisterAcademic';
import RegisterHostelOffice from '../pages/auth/RegisterHostelOffice';
import RegisterGate from '../pages/auth/RegisterGate';
import VerifyOTP from '../pages/auth/VerifyOTP';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Home from '../pages/Home';
import StudentDashboard from '../pages/student/StudentDashboard';
import CreatePass from '../pages/student/CreatePass';
import OutOfStationPass from '../pages/student/OutOfStationPass';
import MyPasses from '../pages/student/MyPasses';
import DepartmentDashboard from '../pages/department/DepartmentDashboard';
import DepartmentPending from '../pages/department/PendingPasses';
import DepartmentStudentLeaves from '../pages/department/StudentLeaves';
import AcademicDashboard from '../pages/academic/AcademicDashboard';
import AcademicPending from '../pages/academic/PendingPasses';
import AcademicStudentLeaves from '../pages/academic/StudentLeaves';
import HostelDashboard from '../pages/hostel/HostelDashboard';
import HostelPending from '../pages/hostel/PendingPasses';
import GateDashboard from '../pages/gate/GateDashboard';
import GateScanner from '../pages/gate/Scanner';
import Creator from '../pages/Creator';
import Footer from '../components/layout/Footer';

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/register/student"
        element={
          <PublicRoute>
            <RegisterStudent />
          </PublicRoute>
        }
      />
      <Route
        path="/register/department"
        element={
          <PublicRoute>
            <RegisterDepartment />
          </PublicRoute>
        }
      />
      <Route
        path="/register/academic"
        element={
          <PublicRoute>
            <RegisterAcademic />
          </PublicRoute>
        }
      />
      <Route
        path="/register/hosteloffice"
        element={
          <PublicRoute>
            <RegisterHostelOffice />
          </PublicRoute>
        }
      />
      <Route
        path="/register/gate"
        element={
          <PublicRoute>
            <RegisterGate />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-otp"
        element={
          <PublicRoute>
            <VerifyOTP />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/creator"
        element={
          <PublicRoute>
            <Creator />
          </PublicRoute>
        }
      />
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Navbar />
            <StudentDashboard />
            <Footer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/create-pass"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Navbar />
            <CreatePass />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/create-pass/out-of-station"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Navbar />
            <OutOfStationPass />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/my-passes"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <Navbar />
            <MyPasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/department/dashboard"
        element={
          <ProtectedRoute allowedRoles={['department']}>
            <Navbar />
            <DepartmentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/department/pending"
        element={
          <ProtectedRoute allowedRoles={['department']}>
            <Navbar />
            <DepartmentPending />
          </ProtectedRoute>
        }
      />
      <Route
        path="/department/student-leaves"
        element={
          <ProtectedRoute allowedRoles={['department']}>
            <Navbar />
            <DepartmentStudentLeaves />
          </ProtectedRoute>
        }
      />
      <Route
        path="/academic/dashboard"
        element={
          <ProtectedRoute allowedRoles={['academic']}>
            <Navbar />
            <AcademicDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/academic/pending"
        element={
          <ProtectedRoute allowedRoles={['academic']}>
            <Navbar />
            <AcademicPending />
          </ProtectedRoute>
        }
      />
      <Route
        path="/academic/student-leaves"
        element={
          <ProtectedRoute allowedRoles={['academic']}>
            <Navbar />
            <AcademicStudentLeaves />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hostel/dashboard"
        element={
          <ProtectedRoute allowedRoles={['hosteloffice']}>
            <Navbar />
            <HostelDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hostel/pending"
        element={
          <ProtectedRoute allowedRoles={['hosteloffice']}>
            <Navbar />
            <HostelPending />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gate/dashboard"
        element={
          <ProtectedRoute allowedRoles={['gate']}>
            <Navbar />
            <GateDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/gate/scanner"
        element={
          <ProtectedRoute allowedRoles={['gate']}>
            <Navbar />
            <GateScanner />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-gray-600 mb-4">Page not found</p>
              <a href="/" className="text-blue-600 hover:underline">
                Go to Home
              </a>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

