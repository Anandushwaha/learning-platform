import api from "./api";

// Teacher course management
const createCourse = async (courseData) => {
  try {
    const response = await api.post("/api/v1/courses/create", courseData);
    return response.data;
  } catch (error) {
    console.error("Create course error:", error);
    throw error;
  }
};

const getTeacherCourses = async () => {
  try {
    const response = await api.get("/api/v1/courses/teacher");
    return response.data;
  } catch (error) {
    console.error("Get teacher courses error:", error);
    throw error;
  }
};

const updateCourse = async (courseId, courseData) => {
  try {
    const response = await api.put(`/api/v1/courses/${courseId}`, courseData);
    return response.data;
  } catch (error) {
    console.error("Update course error:", error);
    throw error;
  }
};

const deleteCourse = async (courseId) => {
  try {
    const response = await api.delete(`/api/v1/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Delete course error:", error);
    throw error;
  }
};

// Student course enrollment
const getAllCourses = async () => {
  try {
    const response = await api.get("/api/v1/courses");
    return response.data;
  } catch (error) {
    console.error("Get all courses error:", error);
    throw error;
  }
};

const enrollInCourse = async (courseId) => {
  try {
    const response = await api.post(`/api/v1/courses/enroll/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Enroll in course error:", error);
    throw error;
  }
};

const getEnrolledCourses = async () => {
  try {
    const response = await api.get("/api/v1/courses/student/enrolled");
    return response.data;
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    throw error;
  }
};

const getCourseById = async (courseId) => {
  try {
    const response = await api.get(`/api/v1/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Get course by ID error:", error);
    throw error;
  }
};

const courseService = {
  createCourse,
  getTeacherCourses,
  updateCourse,
  deleteCourse,
  getAllCourses,
  enrollInCourse,
  getEnrolledCourses,
  getCourseById,
};

export default courseService;
