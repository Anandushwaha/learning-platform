import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Spinner from "./components/Spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./hooks/useAuth";

// Lazy load pages for better performance
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));

// Placeholder components for routes (to be implemented later)
const PlaceholderPage = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Coming Soon</h1>
    <p>This page is under development.</p>
  </div>
);

const RoleBasedRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log("RoleBasedRedirect - Auth state:", {
      isAuthenticated,
      role: user?.role,
      isLoading,
    });
  }, [user, isAuthenticated, isLoading]);

  if (isLoading) {
    console.log("Auth is still loading, showing spinner");
    return <Spinner />;
  }

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  // Redirect based on user role
  if (user.role === "student") {
    console.log("Role is student, redirecting to student dashboard");
    return <Navigate to="/student/dashboard" />;
  } else if (user.role === "teacher" || user.role === "instructor") {
    console.log("Role is teacher/instructor, redirecting to teacher dashboard");
    return <Navigate to="/teacher/dashboard" />;
  } else {
    console.log("Unknown role, redirecting to generic dashboard");
    return <Navigate to="/dashboard" />; // Fallback for other roles
  }
};

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Role-based redirect */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<RoleBasedRedirect />} />
        </Route>

        {/* Generic Dashboard (fallback) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/generic-dashboard" element={<Dashboard />} />
        </Route>

        {/* Student Routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/courses" element={<PlaceholderPage />} />
          <Route path="/student/assignments" element={<PlaceholderPage />} />
          <Route path="/student/grades" element={<PlaceholderPage />} />
          <Route path="/student/calendar" element={<PlaceholderPage />} />
          <Route path="/student/resources" element={<PlaceholderPage />} />
          <Route path="/student/announcements" element={<PlaceholderPage />} />
          <Route path="/student/profile" element={<PlaceholderPage />} />
          <Route path="/student/settings" element={<PlaceholderPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          element={<ProtectedRoute allowedRoles={["teacher", "instructor"]} />}
        >
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/courses" element={<PlaceholderPage />} />
          <Route path="/teacher/assignments" element={<PlaceholderPage />} />
          <Route path="/teacher/submissions" element={<PlaceholderPage />} />
          <Route path="/teacher/gradebook" element={<PlaceholderPage />} />
          <Route path="/teacher/calendar" element={<PlaceholderPage />} />
          <Route path="/teacher/analytics" element={<PlaceholderPage />} />
          <Route path="/teacher/announcements" element={<PlaceholderPage />} />
          <Route
            path="/teacher/announcements/create"
            element={<PlaceholderPage />}
          />
          <Route path="/teacher/profile" element={<PlaceholderPage />} />
          <Route path="/teacher/settings" element={<PlaceholderPage />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          {/* Add admin-specific routes here */}
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
