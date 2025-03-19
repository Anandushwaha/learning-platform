import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import connectDB from "../config/db.js";

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const migrateInstructorToTeacher = async () => {
  try {
    console.log("Starting migration of instructor roles to teacher...");

    // Find all users with role "instructor"
    const instructors = await User.find({ role: "instructor" });

    console.log(`Found ${instructors.length} instructors to migrate`);

    // Update each instructor to have role "teacher"
    for (const instructor of instructors) {
      instructor.role = "teacher";
      await instructor.save();
      console.log(
        `Migrated user ${instructor.email} from instructor to teacher`
      );
    }

    console.log("Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
};

migrateInstructorToTeacher();
