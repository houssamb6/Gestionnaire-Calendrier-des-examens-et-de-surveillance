import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashboardPage from "./chefd/DashboardPage";
import ValidationsPage from "./chefd/ValidationsPage";
import SupervisorsPage from "./chefd/SupervisorsPage";
import StudentsPage from "./chefd/StudentsPage";
import SchedulePage from "./chefd/SchedulePage";
import ReportsPage from "./chefd/ReportsPage";
import Layout from "../components/componentscd/Layout";
import { jwtDecode } from "jwt-decode";

function Chefdepp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    department: "",
    departmentName: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        
        // Map department to user-friendly name
        let displayName = decodedToken.department;
        switch (decodedToken.department) {
          case "Math":
            displayName = "Math";
            break;
          case "Info":
            displayName = "Informatique";
            break;
          case "Technique":
            displayName = "Technique";
            break;
          default:
            displayName = decodedToken.department;
        }
        
        setUserData({
          name: decodedToken.name || "User",
          department: decodedToken.department || "",
          departmentName: displayName
        });
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error decoding token:", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return (
      <Routes>
        <Route path="/" element={
          <Layout userData={userData}>
            <DashboardPage userData={userData} />
          </Layout>
        } />
        <Route path="/validations" element={
          <Layout userData={userData}>
            <ValidationsPage userData={userData} />
          </Layout>
        } />
        <Route path="/supervisors" element={
          <Layout userData={userData}>
            <SupervisorsPage userData={userData} />
          </Layout>
        } />
        <Route path="/students" element={
          <Layout userData={userData}>
            <StudentsPage userData={userData} />
          </Layout>
        } />
        <Route path="/schedule" element={
          <Layout userData={userData}>
            <SchedulePage userData={userData} />
          </Layout>
        } />
        <Route path="/reports" element={
          <Layout userData={userData}>
            <ReportsPage userData={userData} />
          </Layout>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
  );
}

export default Chefdepp;