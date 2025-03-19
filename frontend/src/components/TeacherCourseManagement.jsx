import { useState, useEffect } from "react";
import courseService from "../services/courseService";
import Spinner from "./Spinner";
import "./CourseManagement.css"; // We'll create this file next

const TeacherCourseManagement = ({ onBack }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    className: "",
    division: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch teacher's courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getTeacherCourses();
      setCourses(response.data || []);
      setError(null);
    } catch (err) {
      setError("Failed to load courses. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Open modal for creating a new course
  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    setFormData({
      title: "",
      className: "",
      division: "",
      description: "",
    });
    setShowModal(true);
  };

  // Open modal for editing a course
  const handleOpenEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      className: course.className,
      division: course.division,
      description: course.description || "",
    });
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Handle form submission for creating/updating course
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (selectedCourse) {
        // Update existing course
        const response = await courseService.updateCourse(
          selectedCourse._id,
          formData
        );
        setCourses(
          courses.map((course) =>
            course._id === selectedCourse._id ? response.data : course
          )
        );
        setSuccessMessage("Course updated successfully!");
      } else {
        // Create new course
        const response = await courseService.createCourse(formData);
        setCourses([...courses, response.data]);
        setSuccessMessage("Course created successfully!");
      }
      // Reset form and close modal
      setFormData({
        title: "",
        className: "",
        division: "",
        description: "",
      });
      setSelectedCourse(null);
      setShowModal(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
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

  // Handle delete course
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        setLoading(true);
        await courseService.deleteCourse(courseId);
        setCourses(courses.filter((course) => course._id !== courseId));
        setSuccessMessage("Course deleted successfully!");
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to delete course. Please try again."
        );
        console.error(err);
      } finally {
        setLoading(false);
        // Clear success message after 3 seconds
        if (successMessage) {
          setTimeout(() => setSuccessMessage(""), 3000);
        }
      }
    }
  };

  // Modal component for course form
  const CourseFormModal = ({ isOpen, onClose, onSubmit }) => {
    if (!isOpen) return null;

    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{selectedCourse ? "Edit Course" : "Create Course"}</h2>
            <button onClick={onClose} className="modal-close">
              &times;
            </button>
          </div>
          <form onSubmit={onSubmit} className="course-form">
            <div className="form-group">
              <label htmlFor="title">Course Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                maxLength={100}
                placeholder="e.g., Introduction to Programming"
              />
            </div>
            <div className="form-group">
              <label htmlFor="className">Class Name</label>
              <input
                type="text"
                id="className"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                required
                maxLength={50}
                placeholder="e.g., CS101"
              />
            </div>
            <div className="form-group">
              <label htmlFor="division">Division</label>
              <input
                type="text"
                id="division"
                name="division"
                value={formData.division}
                onChange={handleInputChange}
                required
                maxLength={20}
                placeholder="e.g., A"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                maxLength={500}
                placeholder="Write a brief description of the course..."
                rows={4}
              />
            </div>
            <div className="form-buttons">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedCourse ? "Update Course" : "Create Course"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="course-management">
      <div className="course-management-header">
        <div className="header-left">
          {onBack && (
            <button onClick={onBack} className="btn btn-secondary back-button">
              ← Back to Dashboard
            </button>
          )}
          <h2>Manage Courses</h2>
        </div>
        <button onClick={handleOpenCreateModal} className="btn btn-primary">
          Create New Course
        </button>
      </div>

      {loading && <Spinner />}

      {error && <div className="alert alert-danger">{error}</div>}

      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}

      {courses.length === 0 && !loading ? (
        <div className="empty-state">
          <p>You haven't created any courses yet.</p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            Create Your First Course
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>
                <strong>Class:</strong> {course.className}
              </p>
              <p>
                <strong>Division:</strong> {course.division}
              </p>
              <p>
                <strong>Students Enrolled:</strong>{" "}
                {course.studentsEnrolled?.length || 0}
              </p>
              <div className="course-actions">
                <button
                  onClick={() => handleOpenEditModal(course)}
                  className="btn btn-secondary"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCourse(course._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Course Form Modal */}
      <CourseFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default TeacherCourseManagement;
