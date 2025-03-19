import EnrollmentRequest from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// @desc    Student sends enrollment request to a course teacher
// @route   POST /api/v1/courses/request/:courseId
// @access  Private (Students only)
export const sendEnrollmentRequest = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { message } = req.body;
    const studentId = req.user.id;

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Check if student is already enrolled
    if (course.studentsEnrolled.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course",
      });
    }

    // Verify the teacher exists
    const teacher = await User.findById(course.teacherId);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Check if there's already a pending request
    const existingRequest = await EnrollmentRequest.findOne({
      course: courseId,
      requester: studentId,
      recipient: course.teacherId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this course",
      });
    }

    // Create the enrollment request
    const enrollmentRequest = await EnrollmentRequest.create({
      course: courseId,
      requester: studentId,
      recipient: course.teacherId,
      type: "student_request",
      message,
    });

    res.status(201).json({
      success: true,
      data: enrollmentRequest,
      message: "Enrollment request sent successfully",
    });
  } catch (error) {
    console.error("Send enrollment request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send enrollment request",
      error: error.message,
    });
  }
};

// @desc    Teacher sends invite to a student
// @route   POST /api/v1/courses/invite/:studentId
// @access  Private (Teachers only)
export const sendEnrollmentInvite = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { courseId, message } = req.body;
    const teacherId = req.user.id;

    // Verify the student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Verify the course exists and belongs to the teacher
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.teacherId.toString() !== teacherId) {
      return res.status(403).json({
        success: false,
        message: "You can only invite students to your own courses",
      });
    }

    // Check if student is already enrolled
    if (course.studentsEnrolled.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student is already enrolled in this course",
      });
    }

    // Check if there's already a pending invite
    const existingInvite = await EnrollmentRequest.findOne({
      course: courseId,
      requester: teacherId,
      recipient: studentId,
      status: "pending",
    });

    if (existingInvite) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending invite for this student",
      });
    }

    // Create the enrollment invite
    const enrollmentInvite = await EnrollmentRequest.create({
      course: courseId,
      requester: teacherId,
      recipient: studentId,
      type: "teacher_invite",
      message,
    });

    res.status(201).json({
      success: true,
      data: enrollmentInvite,
      message: "Enrollment invite sent successfully",
    });
  } catch (error) {
    console.error("Send enrollment invite error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send enrollment invite",
      error: error.message,
    });
  }
};

// @desc    Accept an enrollment request
// @route   PUT /api/v1/courses/accept/:requestId
// @access  Private
export const acceptEnrollmentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Find the request
    const request = await EnrollmentRequest.findById(requestId).populate(
      "course"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Enrollment request not found",
      });
    }

    // Verify the user is the recipient of the request
    if (request.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this request",
      });
    }

    // Check if request is already processed
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}`,
      });
    }

    // Update the enrollment request status
    request.status = "accepted";
    await request.save();

    // Add student to the course
    let studentId, courseId;

    if (request.type === "student_request") {
      studentId = request.requester;
      courseId = request.course._id;
    } else {
      // teacher_invite
      studentId = request.recipient;
      courseId = request.course._id;
    }

    // Update the course
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { studentsEnrolled: studentId } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: request,
      message: "Enrollment request accepted successfully",
    });
  } catch (error) {
    console.error("Accept enrollment request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept enrollment request",
      error: error.message,
    });
  }
};

// @desc    Reject an enrollment request
// @route   DELETE /api/v1/courses/reject/:requestId
// @access  Private
export const rejectEnrollmentRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    // Find the request
    const request = await EnrollmentRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Enrollment request not found",
      });
    }

    // Verify the user is the recipient of the request
    if (request.recipient.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this request",
      });
    }

    // Check if request is already processed
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `This request has already been ${request.status}`,
      });
    }

    // Update the enrollment request status
    request.status = "rejected";
    await request.save();

    res.status(200).json({
      success: true,
      data: request,
      message: "Enrollment request rejected successfully",
    });
  } catch (error) {
    console.error("Reject enrollment request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject enrollment request",
      error: error.message,
    });
  }
};

// @desc    Get all pending requests for a user
// @route   GET /api/v1/courses/requests
// @access  Private
export const getPendingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all requests where the user is the recipient
    const pendingRequests = await EnrollmentRequest.find({
      recipient: userId,
      status: "pending",
    })
      .populate({
        path: "course",
        select: "title className division",
      })
      .populate({
        path: "requester",
        select: "name email",
      })
      .populate({
        path: "recipient",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingRequests.length,
      data: pendingRequests,
    });
  } catch (error) {
    console.error("Get pending requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get pending requests",
      error: error.message,
    });
  }
};

// @desc    Get all outgoing requests for a user
// @route   GET /api/v1/courses/requests/outgoing
// @access  Private
export const getOutgoingRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all requests where the user is the requester
    const outgoingRequests = await EnrollmentRequest.find({
      requester: userId,
      status: "pending",
    })
      .populate({
        path: "course",
        select: "title className division",
      })
      .populate({
        path: "requester",
        select: "name email",
      })
      .populate({
        path: "recipient",
        select: "name email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: outgoingRequests.length,
      data: outgoingRequests,
    });
  } catch (error) {
    console.error("Get outgoing requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get outgoing requests",
      error: error.message,
    });
  }
};
