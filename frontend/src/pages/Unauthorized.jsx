import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Unauthorized = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Access Denied
      </h2>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        You don't have permission to access this page. This area is restricted
        to authorized users only.
      </p>
      <Link to={user ? "/dashboard" : "/login"} className="btn btn-primary">
        {user ? "Back to Dashboard" : "Login"}
      </Link>
    </div>
  );
};

export default Unauthorized;
