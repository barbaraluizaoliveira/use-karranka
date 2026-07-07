import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  //const token = localStorage.getItem("token");
  const token = localStorage.getItem("@Karranka:token");
  const isAuthenticated = !!token && token !== "null" && token !== "undefined" && token.length > 10;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}