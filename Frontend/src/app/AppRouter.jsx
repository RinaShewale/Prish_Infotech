import { createBrowserRouter } from "react-router-dom";


// Existing Pages
import HomePage from "../Features/dashboard/Home/Pages/HomePage";
import CoursesPage from "../Features/dashboard/Courses/page/CoursePage";
import BootcampPage from "../Features/dashboard/Courses/page/BootcampPage";
import { RequestCallback } from "../Features/auth/pages/RequestCallback";
import { Login } from "../Features/auth/pages/Login";
import { Register } from "../Features/auth/pages/Register";
import { CourseDetailPage } from "../Features/dashboard/Courses/page/CoursesDetailPage";
import ProfilePage from "../Features/dashboard/Home/Pages/ProfilePage";
import MainLayout from "../Features/dashboard/Courses/Classroom/Layouts/MainLayout";
import ClassroomPage from "../Features/dashboard/Courses/Classroom/pages/ClassroomPage";
import LearningPage from "../Features/dashboard/Courses/Classroom/pages/LearningPage";
import LecturePage from "../Features/dashboard/Courses/Classroom/pages/LecturePage";

// Classroom Pages


export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/courses",
    element: <CoursesPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/bootcamp",
    element: <BootcampPage />,
  },
  {
    path: "/callback",
    element: <RequestCallback />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/cohort/:slug",
    element: <CourseDetailPage />,
  },
  

  // Classroom Routes
  {
    path: "/classroom",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ClassroomPage />,
      },
      {
        path: "course/:courseId",
        element: <LearningPage />,
      },
      {
        path: "course/:courseId/lecture/:lectureId",
        element: <LecturePage />,
      },
    ],
  },
]);