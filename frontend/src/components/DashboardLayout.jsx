import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import "./DashboardLayout.css";

// Icon components
const MenuIcon = () => <i className="fas fa-bars"></i>;
const HomeIcon = () => <i className="fas fa-home"></i>;
const CourseIcon = () => <i className="fas fa-book"></i>;
const AssignmentIcon = () => <i className="fas fa-tasks"></i>;
const GradeIcon = () => <i className="fas fa-chart-bar"></i>;
const SettingsIcon = () => <i className="fas fa-cog"></i>;
const NotificationIcon = () => <i className="fas fa-bell"></i>;
const LogoutIcon = () => <i className="fas fa-sign-out-alt"></i>;
const ChevronLeftIcon = () => (
  <i className="fas fa-chevron-left toggle-icon"></i>
);

const DashboardLayout = ({ children, pageTitle, role }) => {
  const [sidebarClosed, setSidebarClosed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarClosed(!sidebarClosed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileDropdown(false);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotifications(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }

      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation items based on role
  const getNavItems = () => {
    const baseItems = [
      {
        path: `/${role}/dashboard`,
        name: "Dashboard",
        icon: <HomeIcon />,
      },
      {
        path: `/${role}/courses`,
        name: "Courses",
        icon: <CourseIcon />,
      },
      {
        path: `/${role}/assignments`,
        name: "Assignments",
        icon: <AssignmentIcon />,
      },
    ];

    // Add role-specific items
    if (role === "student") {
      baseItems.push({
        path: "/student/grades",
        name: "Grades",
        icon: <GradeIcon />,
      });
    } else if (role === "teacher") {
      baseItems.push({
        path: "/teacher/gradebook",
        name: "Gradebook",
        icon: <GradeIcon />,
      });
    }

    // Add settings for all roles
    baseItems.push({
      path: `/${role}/settings`,
      name: "Settings",
      icon: <SettingsIcon />,
    });

    return baseItems;
  };

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      message: "New assignment has been posted",
      time: "2 hours ago",
      isRead: false,
    },
    {
      id: 2,
      message: "Your assignment has been graded",
      time: "1 day ago",
      isRead: true,
    },
  ];

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className={`dashboard-container ${
        sidebarClosed ? "sidebar-closed" : ""
      } ${mobileMenuOpen ? "sidebar-open" : ""}`}
    >
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <span className="menu-icon"></span>
      </button>

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="app-name">Learning Platform</h1>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <ChevronLeftIcon />
          </button>
        </div>
        <nav className="sidebar-nav">
          <ul>
            {getNavItems().map((item, index) => (
              <li
                key={index}
                className={location.pathname === item.path ? "active" : ""}
              >
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span>
                  <span className="link-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <h2 className="page-title">{pageTitle}</h2>
          <div className="topbar-right">
            {/* Notifications */}
            <div className="notification-container" ref={notificationRef}>
              <button
                className="notification-btn"
                onClick={toggleNotifications}
                data-count={
                  notifications.filter((n) => !n.isRead).length || null
                }
              >
                <NotificationIcon />
              </button>
              {showNotifications && (
                <div className="notification-dropdown">
                  <h3>Notifications</h3>
                  {notifications.length > 0 ? (
                    <ul>
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className={notification.isRead ? "" : "unread"}
                        >
                          <p>{notification.message}</p>
                          <span className="time">{notification.time}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-notifications">No notifications</p>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="profile-container" ref={profileRef}>
              <button className="profile-btn" onClick={toggleProfileDropdown}>
                <div className="profile-avatar">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={user.name} />
                  ) : (
                    getInitials(user?.name || user?.email || "")
                  )}
                </div>
              </button>
              {showProfileDropdown && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <h3>{user?.name || user?.email}</h3>
                    <p>{user?.email}</p>
                    <span className="role-badge">
                      {role === "teacher" ? "Instructor" : "Student"}
                    </span>
                  </div>
                  <ul>
                    <li>
                      <Link to={`/${role}/profile`}>Profile</Link>
                    </li>
                    <li>
                      <Link to={`/${role}/settings`}>Settings</Link>
                    </li>
                  </ul>
                  <button className="logout-btn" onClick={handleLogout}>
                    <LogoutIcon /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="dashboard-content">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
