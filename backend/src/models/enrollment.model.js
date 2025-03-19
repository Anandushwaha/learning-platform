import mongoose from "mongoose";

const enrollmentRequestSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    type: {
      type: String,
      enum: ["student_request", "teacher_invite"],
      required: true,
    },
    message: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique requests
enrollmentRequestSchema.index(
  { course: 1, requester: 1, recipient: 1, status: 1 },
  { unique: true }
);

const EnrollmentRequest = mongoose.model(
  "EnrollmentRequest",
  enrollmentRequestSchema
);

export default EnrollmentRequest;
