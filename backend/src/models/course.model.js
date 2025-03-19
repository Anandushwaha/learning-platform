import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: [100, "Course title cannot exceed 100 characters"],
    },
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      maxlength: [50, "Class name cannot exceed 50 characters"],
    },
    division: {
      type: String,
      required: [true, "Division is required"],
      trim: true,
      maxlength: [20, "Division cannot exceed 20 characters"],
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Teacher ID is required"],
    },
    studentsEnrolled: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "archived"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for getting enrolled student count
courseSchema.virtual("enrolledCount").get(function () {
  return this.studentsEnrolled.length;
});

// Method to check if a student is enrolled
courseSchema.methods.isStudentEnrolled = function (studentId) {
  return this.studentsEnrolled.includes(studentId);
};

const Course = mongoose.model("Course", courseSchema);

export default Course;
