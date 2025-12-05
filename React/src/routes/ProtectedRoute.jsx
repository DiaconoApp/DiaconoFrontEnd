import { Navigate } from "react-router-dom";
import { permissions } from "./roles"; 

export function ProtectedRoute({ children, required }) {
  const token = localStorage.getItem("token");
  const cargo = localStorage.getItem("cargo"); 

  if (!token) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  if (!permissions[cargo]?.includes(required)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}