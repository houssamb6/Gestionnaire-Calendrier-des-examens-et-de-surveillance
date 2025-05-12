import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from "./pages/Register";
import AdminDashboard from "./pages/addmin";
import DirecteurDashboard from "./pages/direcetud";
import Chefdepp from "./pages/Chefdeppp";
import Supervisors from "./pages/Supervisors"
import AddExam from './pages/Exam';
import Students from './pages/Students';
import RoomsPage from './pages/Rooms';
import Schedule from './pages/CalendarExemple';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/directeur" element={<DirecteurDashboard />} />
      <Route path="/dashboard/chef/*" element={<Chefdepp />} />      <Route path="/dashboard/admin/supervisors" element={<Supervisors />} />
      <Route path="/dashboard/admin/exams" element={<AddExam />} />
      <Route path="/dashboard/admin/rooms" element={<RoomsPage />} />
      <Route path="/dashboard/admin/schedule" element={<Schedule />} />
      <Route path="/dashboard/admin/students" element={<Students />} />
    </Routes>
  );
}
