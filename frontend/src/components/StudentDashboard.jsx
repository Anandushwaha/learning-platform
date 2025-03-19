import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import DashboardLayout from "./DashboardLayout";
import StudentCourseManagement from "./StudentCourseManagement";
import EnrollmentRequests from "./EnrollmentRequests";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState({
    enrolledCourses: [],
    upcomingAssignments: [],
    announcements: [],
    recentGrades: [],
    isLoading: true,
    error: null,
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    // Mock data - in a real app, this would be fetched from the backend
    setTimeout(() => {
      setStudentData({
        enrolledCourses: [
          {
            id: 1,
            title: "Introduction to Programming",
            instructor: "Dr. Jane Smith",
            progress: 45,
          },
          {
            id: 2,
            title: "Web Development Fundamentals",
            instructor: "Prof. Michael Johnson",
            progress: 78,
          },
          {
            id: 3,
            title: "Data Structures",
            instructor: "Dr. Robert Davis",
            progress: 32,
          },
        ],
        upcomingAssignments: [
          {
            id: 1,
            title: "JavaScript Functions",
            course: "Web Development Fundamentals",
            dueDate: "2023-11-15",
            status: "pending",
          },
          {
            id: 2,
            title: "Array Manipulation",
            course: "Data Structures",
            dueDate: "2023-11-18",
            status: "pending",
          },
        ],
        announcements: [
          {
            id: 1,
            title: "Midterm Exam Schedule",
            course: "Introduction to Programming",
            date: "2023-11-01",
          },
          {
            id: 2,
            title: "Group Project Details",
            course: "Web Development Fundamentals",
            date: "2023-10-28",
          },
        ],
        recentGrades: [
          {
            id: 1,
            assignment: "Python Basics Quiz",
            course: "Introduction to Programming",
            grade: "85/100",
            date: "2023-10-25",
          },
          {
            id: 2,
            assignment: "HTML/CSS Project",
            course: "Web Development Fundamentals",
            grade: "92/100",
            date: "2023-10-20",
          },
        ],
        isLoading: false,
        error: null,
      });
    }, 1000);
  }, []);

  // Dashboard boxes
  const dashboardBoxes = [
    {
      title: "My Courses",
      icon: "fas fa-book",
      content: (
        <div>
          {studentData.isLoading ? (
            <p>Loading courses...</p>
          ) : (
            <>
              <p>
                You are enrolled in {studentData.enrolledCourses.length} courses
              </p>
              <ul className="dashboard-list">
                {studentData.enrolledCourses.slice(0, 2).map((course) => (
                  <li key={course.id}>
                    <div className="list-item">
                      <div>
                        <strong>{course.title}</strong>
                        <div className="item-info">
                          Instructor: {course.instructor}
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ),
      action: {
        text: "View All Courses",
        handler: () => setActiveView("manageCourses"),
      },
    },
    {
      title: "Assignments",
      icon: "fas fa-tasks",
      content: (
        <div>
          {studentData.isLoading ? (
            <p>Loading assignments...</p>
          ) : (
            <>
              <p>
                You have {studentData.upcomingAssignments.length} upcoming
                assignments
              </p>
              <ul className="dashboard-list">
                {studentData.upcomingAssignments
                  .slice(0, 2)
                  .map((assignment) => (
                    <li key={assignment.id}>
                      <div className="list-item">
                        <div>
                          <strong>{assignment.title}</strong>
                          <div className="item-info">
                            Course: {assignment.course}
                          </div>
                          <div className="item-info">
                            Due:{" "}
                            {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="status-badge">
                          {assignment.status === "pending"
                            ? "Due"
                            : "Submitted"}
                        </div>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      ),
      action: {
        text: "View All Assignments",
        handler: () => navigate("/student/assignments"),
      },
    },
    {
      title: "Announcements",
      icon: "fas fa-bullhorn",
      content: (
        <div>
          {studentData.isLoading ? (
            <p>Loading announcements...</p>
          ) : (
            <>
              <p>Latest class announcements</p>
              <ul className="dashboard-list">
                {studentData.announcements.slice(0, 2).map((announcement) => (
                  <li key={announcement.id}>
                    <div className="list-item">
                      <div>
                        <strong>{announcement.title}</strong>
                        <div className="item-info">
                          Course: {announcement.course}
                        </div>
                        <div className="item-info">
                          Posted:{" "}
                          {new Date(announcement.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ),
      action: {
        text: "View All Announcements",
        handler: () => navigate("/student/announcements"),
      },
    },
    {
      title: "Grades",
      icon: "fas fa-chart-bar",
      content: (
        <div>
          {studentData.isLoading ? (
            <p>Loading grades...</p>
          ) : (
            <>
              <p>Recent grades</p>
              <ul className="dashboard-list">
                {studentData.recentGrades.slice(0, 2).map((grade) => (
                  <li key={grade.id}>
                    <div className="list-item">
                      <div>
                        <strong>{grade.assignment}</strong>
                        <div className="item-info">Course: {grade.course}</div>
                        <div className="item-info">
                          Date: {new Date(grade.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="grade-badge">{grade.grade}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      ),
      action: {
        text: "View All Grades",
        handler: () => navigate("/student/grades"),
      },
    },
    {
      title: "Calendar",
      icon: "fas fa-calendar-alt",
      content: (
        <div>
          <p>Upcoming events and deadlines</p>
          <div className="mini-calendar">
            <div className="calendar-month">November 2023</div>
            <div className="calendar-events">
              <div className="calendar-event">
                <div className="event-date">15</div>
                <div className="event-details">
                  <strong>Assignment Due</strong>
                  <div>JavaScript Functions</div>
                </div>
              </div>
              <div className="calendar-event">
                <div className="event-date">18</div>
                <div className="event-details">
                  <strong>Assignment Due</strong>
                  <div>Array Manipulation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      action: {
        text: "View Calendar",
        handler: () => navigate("/student/calendar"),
      },
    },
    {
      title: "Resources",
      icon: "fas fa-folder",
      content: (
        <div>
          <p>Access study materials and resources</p>
          <ul className="dashboard-list">
            <li>
              <div className="list-item">
                <div>
                  <strong>Course Materials</strong>
                  <div className="item-info">
                    Lecture notes, slides, and reading materials
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="list-item">
                <div>
                  <strong>Library Resources</strong>
                  <div className="item-info">
                    Access online journals and e-books
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      ),
      action: {
        text: "Browse Resources",
        handler: () => {
          setActiveView("browseCourses");
        },
      },
    },
    {
      title: "Enrollment Requests",
      icon: "fas fa-user-plus",
      content: (
        <div>
          <p>View and manage your enrollment requests</p>
          <div className="enrollment-stats">
            <span className="stat-item">
              <i className="fas fa-clock"></i> Pending Requests
            </span>
            <span className="stat-item">
              <i className="fas fa-check"></i> Accepted
            </span>
          </div>
        </div>
      ),
      action: {
        text: "View Requests",
        handler: () => setActiveView("enrollmentRequests"),
      },
    },
  ];

  // Add additional styles
  const additionalStyles = `
    .dashboard-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .dashboard-list li {
      margin-bottom: 10px;
    }
    
    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .item-info {
      font-size: 0.8rem;
      color: #666;
      margin-top: 2px;
    }
    
    .progress-bar {
      width: 60px;
      height: 6px;
      background-color: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-fill {
      height: 100%;
      background-color: #4361ee;
    }
    
    .status-badge, .grade-badge {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #ffeeba;
      color: #856404;
    }
    
    .grade-badge {
      background-color: #d4edda;
      color: #155724;
    }
    
    .mini-calendar {
      margin-top: 10px;
    }
    
    .calendar-month {
      font-weight: 600;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .calendar-events {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .calendar-event {
      display: flex;
      gap: 10px;
    }
    
    .event-date {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #4361ee;
      color: white;
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 600;
    }
    
    .event-details {
      font-size: 0.85rem;
    }
  `;

  return (
    <>
      <style>{additionalStyles}</style>
      <DashboardLayout pageTitle="Student Dashboard" role="student">
        {activeView === "dashboard" && (
          <div className="dashboard-boxes">
            {dashboardBoxes.map((box, index) => (
              <div key={index} className="dashboard-box">
                <div className="box-header">
                  <div className="box-icon">
                    <i className={box.icon}></i>
                  </div>
                  <h3 className="box-title">{box.title}</h3>
                </div>
                <div className="box-content">{box.content}</div>
                <div className="box-footer">
                  <button className="box-btn" onClick={box.action.handler}>
                    {box.action.text}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {activeView === "manageCourses" && (
          <StudentCourseManagement onBack={() => setActiveView("dashboard")} />
        )}
        {activeView === "enrollmentRequests" && (
          <EnrollmentRequests
            userRole="student"
            onBack={() => setActiveView("dashboard")}
          />
        )}
      </DashboardLayout>
    </>
  );
};

export default StudentDashboard;
