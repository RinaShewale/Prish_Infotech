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

// Classroom
import MainLayout from "../Features/dashboard/Courses/Classroom/Layouts/MainLayout";
import ClassroomPage from "../Features/dashboard/Courses/Classroom/pages/ClassroomPage";
import LearningPage from "../Features/dashboard/Courses/Classroom/pages/LearningPage";
import LecturePage from "../Features/dashboard/Courses/Classroom/pages/LecturePage";

// Protected Route
import ProtectedRoute from "../Features/auth/components/ProtectedRoute"; // <-- adjust path if needed
import ForgotPassword from "../Features/auth/pages/ForgotPassword";
import ResetPassword from "../Features/auth/pages/ResetPassword";
import AboutUs from "../Features/dashboard/Home/layout/AboutUs";
import PrivacyPolicy from "../Features/dashboard/Home/layout/PrivacyPolicy";
import TermsCondition from "../Features/dashboard/Home/layout/TermsCondition";
import PricingRefund from "../Features/dashboard/Home/layout/PricingRefund";
import { Hiring } from "../Features/dashboard/Home/layout/Hiring";
import { Support } from "../Features/dashboard/Home/layout/Support";

import AdminDashboard from "../Features/dashboard/adminPanel/pages/AdminDashboard";
import AdminLayout from "../Features/dashboard/adminPanel/layout/AdminLayout";
import AdminCourses from "../Features/dashboard/adminPanel/pages/AdminCourses";
import MediaLibrary from "../Features/dashboard/adminPanel/pages/MediaLibrary";
import Enrollments from "../Features/dashboard/adminPanel/pages/Enrollments";
import Analytics from "../Features/dashboard/adminPanel/components/Analytics";
import AdminCreateCourse from "../Features/dashboard/adminPanel/pages/AdminCreateCourse";
import UserCourseProgress from "../Features/dashboard/adminPanel/components/UserCourseProgress";
import GetContacts from "../Features/dashboard/adminPanel/pages/GetContacts";
import AdminPayments from "../Features/dashboard/adminPanel/pages/AdminPayments";
import AdminCourseDetail from "../Features/dashboard/adminPanel/pages/AdminCourseDetail";
import AdminCreateLesson from "../Features/dashboard/adminPanel/pages/AdminCreateLesson";
import AdminBootcampManagement from "../Features/dashboard/adminPanel/pages/AdminBootcampManagement";
import AdminCoupons from "../Features/dashboard/adminPanel/pages/AdminCoupons";


//footer links

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
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/cohort/:slug",
    element: <CourseDetailPage />,
  },



  { path: "/about-us", element: <AboutUs /> },
  { path: "/privacy-policy", element: <PrivacyPolicy /> },
  { path: "/terms-and-condition", element: <TermsCondition /> },
  { path: "/pricing-and-refund", element: <PricingRefund /> },
  { path: "/hire-from-us", element: <Hiring /> },
  { path: "/support", element: <Support /> },


  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "courses",
        element: <AdminCourses />,
      },

      {
        path: "courses/:slug/add-lesson",
        element: <AdminCreateLesson />
      },

      {
        path: "courses/:slug",
        element: <AdminCourseDetail />,
      },
      {
        path: "courses/create",
        element: <AdminCreateCourse />,
      },
      {
        path: "users",
        element: <GetContacts />,
      },
      {
        path: "enrollments",
        element: <Enrollments />,
      },
      {
        path: "course-progress/:courseId",
        element: <UserCourseProgress />,
      },

  
      {
        path: "payments",
        element: <AdminPayments />,
      },


      {
        path: "media",
        element: <MediaLibrary />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "bootcamps",
        element: <AdminBootcampManagement />,
      },
      {
        path: "coupons",
        element: <AdminCoupons />,
      },
      {
        path: "settings",
        element: (
          <div className="p-10 text-text-secondary italic">
            Global school settings coming soon...
          </div>
        ),
      },
    ],
  },

  // Protected Classroom Routes
  {
    path: "/classroom",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
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