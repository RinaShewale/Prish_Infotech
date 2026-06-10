import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
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
  // 3. WAIT UNTIL ENROLLMENT API FINISHES
  // ==============================
  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ==============================
  // 4. SAFE CHECK (NOW RELIABLE)
  // ==============================
  const safeEnrollments = Array.isArray(enrollments)
    ? enrollments
    : [];

  if (safeEnrollments.length === 0) {
    return <Navigate to="/courses" replace />;
  }

  // ==============================
  // 5. ALLOW ACCESS
  // ==============================
  return children;
};

export default ProtectedRoute;