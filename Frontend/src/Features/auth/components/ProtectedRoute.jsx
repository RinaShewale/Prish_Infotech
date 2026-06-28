import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, authChecked } = useSelector((state) => state.auth);
  const { enrollments, loaded } = useSelector((state) => state.enrollment);

  // ==============================
  // 1. AUTH NOT READY
  // ==============================
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ==============================
  // 2. NOT LOGGED IN
  // ==============================
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // ==============================
  // 3. ADMIN ROLE CHECK
  // ==============================
  // If the route is admin-only and user is NOT an admin, kick them to home
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // IMPORTANT: If user is an Admin, they bypass all enrollment checks 
  // so they can access both Admin Dashboard AND Classroom freely.
  if (user.role === "admin") {
    return children;
  }

  // ==============================
  // 4. STUDENT ENROLLMENT CHECKS
  // (Only runs for non-admin users)
  // ==============================
  
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const safeEnrollments = Array.isArray(enrollments) ? enrollments : [];

  if (safeEnrollments.length === 0) {
    return <Navigate to="/courses" replace />;
  }

  // ==============================
  // 5. ALLOW ACCESS (STUDENT WITH ENROLLMENTS)
  // ==============================
  return children;
};

export default ProtectedRoute;