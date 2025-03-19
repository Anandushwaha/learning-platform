import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// @desc    Create a new course
// @route   POST /api/v1/courses/create
// @access  Private (Teachers only)
export const createCourse = async (req, res) => {
  try {
    const { title, className, division, description } = req.body;

    // Create course with teacher ID from authenticated user
    const course = await Course.create({
      title,
      className,
      division,
      description,
      teacherId: req.user.id,
      studentsEnrolled: [],
    });

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

// @desc    Get all courses created by a teacher
// @route   GET /api/v1/courses/teacher
// @access  Private (Teachers only)
export const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacherId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Get teacher courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

// @desc    Get all available courses
// @route   GET /api/v1/courses
// @access  Private
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "active" })
      .populate("teacherId", "name email")
      .select("title className division description teacherId studentsEnrolled")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Get all courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve courses",
      error: error.message,
    });
  }
};

// @desc    Get a single course by ID
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("teacherId", "name email")
      .populate("studentsEnrolled", "name email");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Get course by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve course",
      error: error.message,
    });
  }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Teachers only)
export const updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the course belongs to the logged-in teacher
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this course",
      });
    }

    // Fields that can be updated
    const { title, className, division, description, status } = req.body;

    // Update the course
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, className, division, description, status },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update course",
      error: error.message,
    });
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Teachers only)
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if the course belongs to the logged-in teacher
    if (course.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this course",
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete course",
      error: error.message,
    });
  }
};

// @desc    Enroll a student in a course
// @route   POST /api/courses/enroll/:id
// @access  Private (Students only)
export const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if student is already enrolled
    if (course.studentsEnrolled.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Add student to enrolled list
    course.studentsEnrolled.push(req.user.id);
    await course.save();

    res.status(200).json({
      success: true,
      message: "Enrolled in course successfully",
      data: course,
    });
  } catch (error) {
    console.error("Enroll in course error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enroll in course",
      error: error.message,
    });
  }
};

// @desc    Get courses a student is enrolled in
// @route   GET /api/courses/student/enrolled
// @access  Private (Students only)
export const getEnrolledCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      studentsEnrolled: req.user.id,
      status: "active",
    })
      .populate("teacherId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    console.error("Get enrolled courses error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve enrolled courses",
      error: error.message,
    });
  }
};
