import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on page load
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        // Only check if we haven't already checked and if there's a token
        if (!authChecked && localStorage.getItem("token")) {
          console.log("Token found, checking current user...");
          const userData = await authService.getCurrentUser();
          if (userData) {
            console.log("User data received:", userData);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Clear token if no user found
            console.log("No user data received, clearing token");
            localStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    checkUserLoggedIn();
  }, [authChecked]);

  // Redirect user based on role
  const redirectBasedOnRole = (userData) => {
    console.log("Redirecting based on role:", userData?.role);

    if (!userData) {
      console.log("No user data, cannot redirect");
      return;
    }

    switch (userData.role) {
      case "student":
        console.log("User is a student, redirecting to student dashboard");
        navigate("/student/dashboard");
        break;
      case "instructor":
        console.log("User is an instructor, redirecting to teacher dashboard");
        navigate("/teacher/dashboard");
        break;
      case "teacher":
        console.log("User is a teacher, redirecting to teacher dashboard");
        navigate("/teacher/dashboard");
        break;
      default:
        console.log("Unknown role, redirecting to main dashboard");
        navigate("/dashboard");
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      console.log("Registering user with data:", {
        ...userData,
        password: "****",
      });
      const response = await authService.register(userData);
      console.log("Registration response:", response);
      const user = response.data;
      setUser(user);
      setIsAuthenticated(true);
      toast.success("Registration successful!");
      redirectBasedOnRole(user);
      return response;
    } catch (error) {
      console.error("Registration error details:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setIsLoading(true);
      console.log("Logging in user with email:", userData.email);
      const response = await authService.login(userData);
      console.log("Login response:", response);
      const user = response.data;
      setUser(user);
      setIsAuthenticated(true);
      toast.success("Login successful!");
      redirectBasedOnRole(user);
      return response;
    } catch (error) {
      console.error("Login error details:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(false);
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
