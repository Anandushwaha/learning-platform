import { useState, useEffect } from "react";
import courseService from "../services/courseService";
import Spinner from "./Spinner";
import "./CourseManagement.css";

const StudentCourseManagement = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch available courses and enrolled courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      // Fetch all available courses
      const availableResponse = await courseService.getAllCourses();
      setAvailableCourses(availableResponse.data || []);

      // Fetch courses the student is enrolled in
      const enrolledResponse = await courseService.getEnrolledCourses();
      setEnrolledCourses(enrolledResponse.data || []);

      setError(null);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Enroll in a course
  const handleEnroll = async (courseId) => {
    try {
      setLoading(true);
      const response = await courseService.enrollInCourse(courseId);

      // Refresh the courses after enrollment
      fetchCourses();

      setSuccessMessage("Successfully enrolled in the course!");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to enroll. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
      // Clear success message after 3 seconds
      if (successMessage) {
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  // Check if student is already enrolled in a course
  const isEnrolled = (courseId) => {
    return enrolledCourses.some((course) => course._id === courseId);
  };

  return (
    <div className="course-management">
      <div className="course-management-header">
        <h2>Available Courses</h2>
      </div>

      {loading && <Spinner />}

      {error && <div className="alert alert-danger">{error}</div>}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {availableCourses.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No courses are available at the moment.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {availableCourses.map((course) => {
            const enrolled = isEnrolled(course._id);

            return (
              <div
                key={course._id}
                className={`course-card ${enrolled ? "enrolled" : ""}`}
              >
                <h3>{course.title}</h3>
                <p>
                  <strong>Class:</strong> {course.className}
                </p>
                <p>
                  <strong>Division:</strong> {course.division}
                </p>
                <p>
                  <strong>Teacher:</strong>{" "}
                  {course.teacherId?.name || "Unknown Teacher"}
                </p>
                <p>
                  <strong>Students Enrolled:</strong>{" "}
                  {course.studentsEnrolled?.length || 0}
                </p>
                <div className="course-actions">
                  {enrolled ? (
                    <span className="enrolled-label">Already Enrolled</span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course._id)}
                      className="btn btn-primary"
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentCourseManagement;
