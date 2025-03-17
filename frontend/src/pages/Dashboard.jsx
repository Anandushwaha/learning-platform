import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import Spinner from "../components/Spinner";

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    notifications: 0,
  });

  useEffect(() => {
    // In a real app, you would fetch this data from the API
    // For now, we'll just simulate it
    const fetchStats = () => {
      // Simulate API call
      setTimeout(() => {
        setStats({
          courses: user?.role === "student" ? 5 : 3,
          assignments: user?.role === "student" ? 12 : 8,
          notifications: 4,
        });
      }, 1000);
    };

    fetchStats();
  }, [user]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            {user?.role === "student" ? "My Courses" : "Courses Teaching"}
          </h2>
          <p className="text-4xl font-bold text-blue-600">{stats.courses}</p>
          <p className="text-gray-600 mt-2">
            {user?.role === "student" ? "Enrolled courses" : "Active courses"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Assignments</h2>
          <p className="text-4xl font-bold text-green-600">
            {stats.assignments}
          </p>
          <p className="text-gray-600 mt-2">
            {user?.role === "student" ? "Pending submissions" : "To be graded"}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Notifications</h2>
          <p className="text-4xl font-bold text-purple-600">
            {stats.notifications}
          </p>
          <p className="text-gray-600 mt-2">Unread notifications</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            {user?.role === "student" ? "Browse Courses" : "Create Course"}
          </button>
          <button className="btn btn-primary">
            {user?.role === "student"
              ? "View Assignments"
              : "Create Assignment"}
          </button>
          <button className="btn btn-primary">Join Live Class</button>
          <button className="btn btn-primary">
            {user?.role === "student" ? "Ask Question" : "Answer Questions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
