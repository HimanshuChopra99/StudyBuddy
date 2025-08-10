# StudyBuddy - EdTech Platform 🚀 [![Live Link](https://img.shields.io/badge/Live%20Link-StudyBuddy-blue?style=for-the-badge)](https://study-buddy-beige.vercel.app)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)]()
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)]()
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)]()
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)]()
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongodb&logoColor=white)]()
[![Zod](https://img.shields.io/badge/Zod-4285F4?style=for-the-badge&labelColor=white)]()



## Description 📚
StudyBuddy is a comprehensive AI-Powered EdTech platform designed to facilitate online learning and teaching. It provides features for user authentication, profile management, course creation and enrollment, payment processing, and AI-assisted learning experiences. The platform leverages technologies such as JavaScript, React, Next.js, Express, and MongoDB to deliver a robust and scalable learning environment. Both students and instructors can benefit from StudyBuddy's features. The front end is a React based app styled with Tailwind CSS and the backend is based on Node.js and Express.



## Table of Contents 📑
- [Features ✨](#features-%E2%9C%A8)
- [Tech Stack 💻](#tech-stack-%F0%9F%92%BB)
- [Installation 🛠️](#installation-%F0%9F%95%A7)
- [Usage 🚀](#usage-%F0%9F%9A%80)
- [Project Structure 📂](#project-structure-%F0%9F%97%82)
- [API Reference ⚙️](#api-reference-%E2%9A%99%EF%B8%8F)
- [Contributing 🙌](#contributing-%F0%9F%99%8C)
- [License 📝](#license-%F0%9F%93%9D)
- [Important Links 🔗](#important-links-%F0%9F%95%91)
- [Footer 👣](#footer-%F0%9F%91%A3)



## Features ✨
- **User Authentication:** Secure signup, login, and password reset functionalities using OTP verification and JWT.
- **Profile Management:** Allows users to update their profiles, including personal details and display pictures.
- **Course Management:** Enables instructors to create, edit, and delete courses, sections, and subsections.
- **Category Management:** Supports the creation and retrieval of course categories.
- **Payment Integration:** Implements payment processing via Razorpay for course enrollments.
- **AI-Powered Features:** Integrates AI for thumbnail generation, chatbot assistance, and video summarization using Gemini API and AssemblyAI.
- **Rating and Reviews:** Provides a system for users to rate and review courses.
- **Course Progress Tracking:** Tracks students' progress within enrolled courses.
- **Instructor Dashboard:** Provides instructors with a dashboard to view course statistics and manage their courses.
- **AI Moderation System:** Automatically detects and filters inappropriate content in comments to maintain a safe and positive learning environment in StudyBuddy.



## Tech Stack 💻
- **Frontend:**
  - React ⚛️
  - Redux Toolkit 🧰
  - Tailwind CSS 🎨
  - Video.js
  - video-react
  - Axios 
- **Backend:**
  - Node.js ⚙️
  - Express 🌐
  - Mongoose 🍃
- **AI Integration:**
  - Google Gemini API 
  - AssemblyAI
  - Pollination AI
- **Other:**
  - JavaScript
  - Zod 
  - JSON
  - JWT (authentication)



## Installation 🛠️
1. **Clone the repository:**
   ```bash
   git clone https://github.com/HimanshuChopra99/StudyBuddy.git
   cd StudyBuddy
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

   - Create a `.env` file in the `backend` directory.
   - Add the following environment variables (example values):
     ```
     PORT=3000
     MONGODB_URL=<Your MongoDB Connection URL>
     JWT_SECRET=<Your JWT Secret Key>
     RAZORPAY_KEY=<Your Razorpay Key>
     RAZORPAY_SECRET=<Your Razorpay Secret>
     CLOUD_NAME=<Your Cloudinary Cloud Name>
     API_KEY=<Your Cloudinary API Key>
     API_SECRET=<Your Cloudinary API Secret>
     EMAIL_HOST=<Your Email Host>
     EMAIL_USER=<Your Email User>
     EMAIL_PASS=<Your Email Password>
     GEMINI_API_KEY=<Your Gemini API Key>
     ASSEMBLY_AI=<Your Assembly AI Key>
     IMAGE_AI=<Your Image AI Key>
     FOLDER_NAME=StudyBuddy
     ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```

   - Create a `.env` file in the `frontend` directory.
   - Add the following environment variable (example value):
     ```
     VITE_BASE_URL=http://localhost:3000/api/v1
     VITE_RAZORPAY_KEY=<Your Razorpay Key>
     ```



## Usage 🚀
1. **Start the Backend:**
   ```bash
   cd backend
   npm run dev # or npm start
   ```
   This will start the backend server, typically on port 3000.

2. **Start the Frontend:**
   ```bash
   cd frontend
   npm run dev # or npm start
   ```
   This will start the frontend development server, usually on port 5173.

3. **Access the Application:**
   Open your web browser and navigate to `http://localhost:5173` to access the StudyBuddy platform.

**Use Cases:**

*   **Student Learning:** Students can browse courses, enroll, track progress, and engage with course content.
*   **Instructor Teaching:** Instructors can create and manage courses, upload content, and interact with students.
*   **AI-Assisted Learning:** Utilize AI features for generating course thumbnails, chatbot assistance for queries, and video summarization to enhance the learning experience.



## Project Structure 📂
```
StudyBuddy/
├── backend/
│   ├── config/         # Configuration files for database, Cloudinary, etc.
│   ├── controllers/    # Handles business logic for routes
│   ├── middlewares/    # Authentication and authorization middlewares
│   ├── models/         # Defines data models using Mongoose
│   ├── routes/         # Defines API endpoints
│   ├── utils/          # Utility functions (mail sender, image uploader, etc.)
│   ├── validation/     # Zod validation schemas
│   ├── index.js        # Main entry point for the backend server
│   └── package.json    # Lists backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/   # React components for the user interface
│   │   ├── pages/        # React pages for different routes
│   │   ├── redux/        # Redux store, slices, and actions
│   │   ├── services/     # API services and connector
│   │   ├── assets/       # Static assets (images, videos, etc.)
│   │   ├── App.jsx       # Main application component
│   │   └── main.jsx      # Entry point for the frontend application
│   ├── public/        # Public assets (e.g., index.html)
│   ├── index.html     # Main HTML file
│   └── package.json    # Lists frontend dependencies
└── README.md         # Project documentation
```



## API Reference ⚙️
The backend API is structured around RESTful principles. Key endpoints include:

**Authentication:**
- `POST /api/v1/auth/sendotp`: Sends OTP for email verification.
- `POST /api/v1/auth/signup`: Registers a new user.
- `POST /api/v1/auth/login`: Logs in an existing user.
- `POST /api/v1/auth/reset-password-token`: Generates a token for password reset.
- `POST /api/v1/auth/reset-password`: Resets the user's password.

**Profile:**
- `GET /api/v1/profile/getUserDetails`: Retrieves user details.
- `PUT /api/v1/profile/updateProfile`: Updates user profile information.
- `PUT /api/v1/profile/updateDisplayPicture`: Updates the user's display picture.
- `DELETE /api/v1/profile/deleteAccount`: Deletes the user account.
- `GET /api/v1/profile/getEnrolledCourses`: Retrieves the courses enrolled by the user.
- `GET /api/v1/profile/instructorDashboard`: Retrieves data for the instructor dashboard.

**Course:**
- `GET /api/v1/course/getAllCourses`: Retrieves all available courses.
- `GET /api/v1/course/getCourseDetails`: Retrieves details for a specific course.
- `POST /api/v1/course/createCourse`: Creates a new course (Instructor only).
- `POST /api/v1/course/addSection`: Adds a section to a course (Instructor only).
- `POST /api/v1/course/addSubSection`: Adds a sub-section to a section (Instructor only).
- `POST /api/v1/course/updateSection`: Updates a section (Instructor only).
- `POST /api/v1/course/updateSubSection`: Updates a sub-section (Instructor only).
- `DELETE /api/v1/course/deleteSection`: Deletes a section (Instructor only).
- `DELETE /api/v1/course/deleteSubSection`: Deletes a sub-section (Instructor only).
- `GET /api/v1/course/getInstructorCourses`: Retrieves courses created by an instructor.
- `POST   /api/v1/course/getFullCourseDetails`: Retrieves full course details for enrolled student.

**Payment:**
- `POST /api/v1/payment/capturePayment`: Captures payment for course enrollment.
- `POST /api/v1/payment/verifyPayment`: Verifies the payment status.
- `POST /api/v1/payment/sendPaymentSuccessEmail`: Sends a payment success email.

**AI Features:**
- `POST /api/v1/course/thumbnail/generate-thumbnail`: Generates a course thumbnail using AI.
- `POST /api/v1/course/chatbot/message`: Sends a message to the chatbot.
- `POST  /api/v1/course/video/summary`: Generates video summary.



## Contributing 🙌
Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Test your changes thoroughly.
5.  Submit a pull request with a clear explanation of your changes.



## License 📝
This project has no license.



## Important Links 🔗
- **Repository Link:** [https://github.com/HimanshuChopra99/StudyBuddy](https://github.com/HimanshuChopra99/StudyBuddy)
- **Author LinkedIn profile:** [https://www.linkedin.com/in/himanshuchopra99](https://www.linkedin.com/in/himanshuchopra99)
- **Author Github profile:** [https://github.com/HimanshuChopra99](https://github.com/HimanshuChopra99)



## Footer 👣
- Repository Name: StudyBuddy
- Repository URL: [https://github.com/HimanshuChopra99/StudyBuddy](https://github.com/HimanshuChopra99/StudyBuddy)
- Author: Himanshu
- Contact: choprahimanshu99@gmail.com

If you find this project interesting, consider contributing, forking, starring ⭐ the repository, or raising issues 🐛 to help improve it! 😉
