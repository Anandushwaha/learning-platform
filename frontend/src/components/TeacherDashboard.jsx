import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import DashboardLayout from "./DashboardLayout";
import { useNavigate } from "react-router-dom";

const TeacherDashboard = () => {
  const [teacherData, setTeacherData] = useState({
    courses: [],
    pendingAssignments: [],
    studentSubmissions: [],
    announcements: [],
    isLoading: true,
    error: null,
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock data - in a real app, this would be fetched from the backend
    setTimeout(() => {
      setTeacherData({
        courses: [
          {
            id: 1,
            title: "Introduction to Programming",
            students: 32,
            sessions: 24,
            completed: 15,
          },
          {
            id: 2,
            title: "Web Development Fundamentals",
            students: 28,
            sessions: 30,
            completed: 18,
          },
          {
            id: 3,
            title: "Data Structures",
            students: 21,
            sessions: 36,
            completed: 10,
          },
        ],
        pendingAssignments: [
          {
            id: 1,
            title: "JavaScript Functions",
            course: "Web Development Fundamentals",
            dueDate: "2023-11-15",
            submissions: 12,
            totalStudents: 28,
          },
          {
            id: 2,
            title: "Array Manipulation",
            course: "Data Structures",
            dueDate: "2023-11-18",
            submissions: 5,
            totalStudents: 21,
          },
        ],
        studentSubmissions: [
          {
            id: 1,
            student: "Alex Johnson",
            assignment: "Python Basics Quiz",
            course: "Introduction to Programming",
            submittedDate: "2023-10-25",
            status: "pending",
          },
          {
            id: 2,
            student: "Emma Wilson",
            assignment: "HTML/CSS Project",
            course: "Web Development Fundamentals",
            submittedDate: "2023-10-24",
            status: "pending",
          },
          {
            id: 3,
            student: "Daniel Clark",
            assignment: "Binary Tree Implementation",
            course: "Data Structures",
            submittedDate: "2023-10-23",
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
        isLoading: false,
        error: null,
      });
    }, 1000);
  }, []);

  // Dashboard boxes
  const dashboardBoxes = [
    {
      title: "My Courses",
      icon: "fas fa-chalkboard-teacher",
      content: (
        <div>
          {teacherData.isLoading ? (
            <p>Loading courses...</p>
          ) : (
            <>
              <p>You are teaching {teacherData.courses.length} courses</p>
              <ul className="dashboard-list">
                {teacherData.courses.slice(0, 2).map((course) => (
                  <li key={course.id}>
                    <div className="list-item">
                      <div>
                        <strong>{course.title}</strong>
                        <div className="item-info">
                          {course.students} students enrolled
                        </div>
                        <div className="item-info">
                          {course.completed}/{course.sessions} sessions
                          completed
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${
                              (course.completed / course.sessions) * 100
                            }%`,
                          }}
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
        text: "Manage Courses",
        handler: () => navigate("/teacher/courses"),
      },
    },
    {
      title: "Assignments",
      icon: "fas fa-tasks",
      content: (
        <div>
          {teacherData.isLoading ? (
            <p>Loading assignments...</p>
          ) : (
            <>
              <p>
                You have {teacherData.pendingAssignments.length} active
                assignments
              </p>
              <ul className="dashboard-list">
                {teacherData.pendingAssignments
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
                        <div className="submission-counter">
                          {assignment.submissions}/{assignment.totalStudents}
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
        text: "Manage Assignments",
        handler: () => navigate("/teacher/assignments"),
      },
    },
    {
      title: "Student Submissions",
      icon: "fas fa-file-alt",
      content: (
        <div>
          {teacherData.isLoading ? (
            <p>Loading submissions...</p>
          ) : (
            <>
              <p>
                {teacherData.studentSubmissions.length} submissions to grade
              </p>
              <ul className="dashboard-list">
                {teacherData.studentSubmissions
                  .slice(0, 2)
                  .map((submission) => (
                    <li key={submission.id}>
                      <div className="list-item">
                        <div>
                          <strong>{submission.assignment}</strong>
                          <div className="item-info">
                            Student: {submission.student}
                          </div>
                          <div className="item-info">
                            Submitted:{" "}
                            {new Date(
                              submission.submittedDate
                            ).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="status-badge">{submission.status}</div>
                      </div>
                    </li>
                  ))}
              </ul>
            </>
          )}
        </div>
      ),
      action: {
        text: "Grade Submissions",
        handler: () => navigate("/teacher/submissions"),
      },
    },
    {
      title: "Announcements",
      icon: "fas fa-bullhorn",
      content: (
        <div>
          {teacherData.isLoading ? (
            <p>Loading announcements...</p>
          ) : (
            <>
              <p>Manage course announcements</p>
              <ul className="dashboard-list">
                {teacherData.announcements.slice(0, 2).map((announcement) => (
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
        text: "Create Announcement",
        handler: () => navigate("/teacher/announcements/create"),
      },
    },
    {
      title: "Calendar",
      icon: "fas fa-calendar-alt",
      content: (
        <div>
          <p>Teaching schedule and important dates</p>
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
        text: "View Schedule",
        handler: () => navigate("/teacher/calendar"),
      },
    },
    {
      title: "Course Analytics",
      icon: "fas fa-chart-line",
      content: (
        <div>
          <p>Student performance and course insights</p>
          <div className="analytics-preview">
            <div className="analytics-card">
              <div className="analytics-title">Avg. Assignment Score</div>
              <div className="analytics-value">78%</div>
            </div>
            <div className="analytics-card">
              <div className="analytics-title">Avg. Course Completion</div>
              <div className="analytics-value">65%</div>
            </div>
          </div>
        </div>
      ),
      action: {
        text: "View Analytics",
        handler: () => navigate("/teacher/analytics"),
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
    
    .status-badge {
      font-size: 0.7rem;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #ffeeba;
      color: #856404;
      text-transform: capitalize;
    }
    
    .submission-counter {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 12px;
      background-color: #d6f5ec;
      color: #0c6e5a;
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
    
    .analytics-preview {
      display: flex;
      gap: 10px;
      margin-top: 10px;
    }
    
    .analytics-card {
      flex: 1;
      background-color: rgba(67, 97, 238, 0.05);
      padding: 10px;
      border-radius: 6px;
      text-align: center;
    }
    
    .analytics-title {
      font-size: 0.7rem;
      color: #666;
      margin-bottom: 5px;
    }
    
    .analytics-value {
      font-size: 1.2rem;
      font-weight: 600;
      color: #4361ee;
    }
  `;

  return (
    <>
      <style>{additionalStyles}</style>
      <DashboardLayout pageTitle="Teacher Dashboard" role="teacher">
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
      </DashboardLayout>
    </>
  );
};

export default TeacherDashboard;
