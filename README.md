# Online Learning Platform

A full-stack online learning platform where teachers can manage courses, upload lectures, and interact with students, while students can enroll, attend classes, and submit assignments.

## Features (Planned)

1. **Authentication System**

   - JWT-based authentication
   - User roles (Student, Teacher, Admin)
   - Secure password handling

2. **User Role Management**

   - Role-based access control
   - Different dashboards for different roles

3. **Course Management**

   - Create, update, delete courses
   - Course categories and search

4. **Enrollment System**

   - Approval-based course joining
   - Course progress tracking

5. **Lecture Management**

   - Upload videos and notes
   - Organize content by modules

6. **Assignment Management**

   - Submission system
   - Grading and feedback

7. **Live Classes**

   - Real-time video streaming
   - Interactive sessions

8. **Query Resolution System**

   - Q&A forums for each course
   - Direct messaging

9. **Job Board for Students**

   - Companies can post jobs
   - Students can apply

10. **Notifications System**
    - Real-time updates via WebSockets
    - Email notifications

## Tech Stack

### Frontend

- React.js (Vite)
- React Router for navigation
- Context API for state management
- Tailwind CSS for styling
- Axios for API requests

### Backend

- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- WebSockets for real-time features

### Storage

- Cloudinary for media storage (planned)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/online-learning-platform.git
   cd online-learning-platform
   ```

2. Install backend dependencies

   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies

   ```
   cd ../frontend
   npm install
   ```

4. Set up environment variables

   - Create a `.env` file in the backend directory based on the `.env.example`

5. Start the development servers

   Backend:

   ```
   cd backend
   npm run dev
   ```

   Frontend:

   ```
   cd frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000`

## Development Roadmap

We are following a structured step-by-step approach:

1. ✅ Authentication System
2. ⬜ User Role Management
3. ⬜ Course Management
4. ⬜ Enrollment System
5. ⬜ Lecture Management
6. ⬜ Assignment Management
7. ⬜ Live Classes
8. ⬜ Query Resolution System
9. ⬜ Job Board
10. ⬜ Notifications System
11. ⬜ UI Enhancements & Testing
12. ⬜ Deployment

## License

This project is licensed under the MIT License - see the LICENSE file for details.
