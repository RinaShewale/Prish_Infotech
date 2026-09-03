import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// Lazy-loaded Pages
const pageLoaders = {
  "/": () => import("../Features/dashboard/Home/Pages/HomePage"),
  "/courses": () => import("../Features/dashboard/Courses/page/CoursePage"),
  "/bootcamp": () => import("../Features/dashboard/Courses/page/BootcampPage"),
  "/callback": () => import("../Features/auth/pages/RequestCallback").then(m => ({ default: m.RequestCallback })),
  "/login": () => import("../Features/auth/pages/Login").then(m => ({ default: m.Login })),
  "/register": () => import("../Features/auth/pages/Register").then(m => ({ default: m.Register })),
};

const HomePage = lazy(pageLoaders["/"]);
const CoursesPage = lazy(pageLoaders["/courses"]);
const BootcampPage = lazy(pageLoaders["/bootcamp"]);
const RequestCallback = lazy(pageLoaders["/callback"]);
const Login = lazy(pageLoaders["/login"]);
const Register = lazy(pageLoaders["/register"]);
const CourseDetailPage = lazy(() => import("../Features/dashboard/Courses/page/CoursesDetailPage").then(m => ({ default: m.CourseDetailPage })));
const ProfilePage = lazy(() => import("../Features/dashboard/Home/Pages/ProfilePage"));
const ForgotPassword = lazy(() => import("../Features/auth/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../Features/auth/pages/ResetPassword"));

// Footer Pages
const AboutUs = lazy(() => import("../Features/dashboard/Home/layout/AboutUs"));
const PrivacyPolicy = lazy(() => import("../Features/dashboard/Home/layout/PrivacyPolicy"));
const TermsCondition = lazy(() => import("../Features/dashboard/Home/layout/TermsCondition"));
const PricingRefund = lazy(() => import("../Features/dashboard/Home/layout/PricingRefund"));
const Support = lazy(() => import("../Features/dashboard/Home/layout/Support").then(m => ({ default: m.Support })));

// Classroom
const MainLayout = lazy(() => import("../Features/dashboard/Courses/Classroom/Layouts/MainLayout"));
const ClassroomPage = lazy(() => import("../Features/dashboard/Courses/Classroom/pages/ClassroomPage"));
const LearningPage = lazy(() => import("../Features/dashboard/Courses/Classroom/pages/LearningPage"));
const LecturePage = lazy(() => import("../Features/dashboard/Courses/Classroom/pages/LecturePage"));

// Admin
const AdminLayout = lazy(() => import("../Features/dashboard/adminPanel/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminDashboard"));
const AdminCourses = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminCourses"));
const MediaLibrary = lazy(() => import("../Features/dashboard/adminPanel/pages/MediaLibrary"));
const Enrollments = lazy(() => import("../Features/dashboard/adminPanel/pages/Enrollments"));
const Analytics = lazy(() => import("../Features/dashboard/adminPanel/components/Analytics"));
const AdminCreateCourse = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminCreateCourse"));
const UserCourseProgress = lazy(() => import("../Features/dashboard/adminPanel/components/UserCourseProgress"));
const GetContacts = lazy(() => import("../Features/dashboard/adminPanel/pages/GetContacts"));
const AdminPayments = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminPayments"));
const AdminCourseDetail = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminCourseDetail"));
const AdminCreateLesson = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminCreateLesson"));
const AdminBootcampManagement = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminBootcampManagement"));
const AdminCoupons = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminCoupons"));
const AdminBootcamp = lazy(() => import("../Features/dashboard/adminPanel/pages/AdminBootcamp"));
const AdminBootcampUpdate = lazy(() => import("../Features/dashboard/adminPanel/components/AdminBootcampUpdate"));
const AdminSettings = lazy(() => import("../Features/dashboard/adminPanel/components/AdminSettings"));

// Protected Route (kept eager — it's tiny and needed everywhere)
import ProtectedRoute from "../Features/auth/components/ProtectedRoute";

// Suspense wrapper — minimal spinner matching the site's dark theme
function SuspenseWrapper({ children }) {
  return (
    <Suspense fallback={<PageLoading />}>
      {children}
    </Suspense>
  );
}

function PageLoading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center" aria-busy="true" aria-label="Loading page">
      <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

export const preloadRoute = (path) => {
  const loadPage = pageLoaders[path];
  if (loadPage) {
    loadPage();
  }
};

// Helper to wrap element with Suspense
const S = (Component) => (
  <SuspenseWrapper>
    <Component />
  </SuspenseWrapper>
);

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: S(HomePage),
  },
  {
    path: "/courses",
    element: S(CoursesPage),
  },
  {
    path: "/profile",
    element: S(ProfilePage),
  },
  {
    path: "/bootcamp",
    element: S(BootcampPage),
  },


  {
    path: "/callback",
    element: S(RequestCallback),
  },
  {
    path: "/login",
    element: S(Login),
  },
  {
    path: "/register",
    element: S(Register),
  },

  {
    path: "/forgot-password",
    element: S(ForgotPassword),
  },
  {
    path: "/reset-password/:token",
    element: S(ResetPassword),
  },
  {
    path: "/cohort/:slug",
    element: S(CourseDetailPage),
  },



  { path: "/about-us", element: S(AboutUs) },
  { path: "/privacy-policy", element: S(PrivacyPolicy) },
  { path: "/terms-and-condition", element: S(TermsCondition) },
  { path: "/pricing-and-refund", element: S(PricingRefund) },
  { path: "/support", element: S(Support) },


  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly={true}>
        <SuspenseWrapper>
          <AdminLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: S(AdminDashboard),
      },
      {
        path: "courses",
        element: S(AdminCourses),
      },

      {
        path: "courses/:slug/add-lesson",
        element: S(AdminCreateLesson),
      },


      {
        path: "courses/:slug",
        element: S(AdminCourseDetail),
      },
      {
        path: "courses/create",
        element: S(AdminCreateCourse),
      },
      {
        path: "users",
        element: S(GetContacts),
      },
      {
        path: "enrollments",
        element: S(Enrollments),
      },
      {
        path: "course-progress/:courseId",
        element: S(UserCourseProgress),
      },


      {
        path: "payments",
        element: S(AdminPayments),
      },


      {
        path: "media",
        element: S(MediaLibrary),
      },
      {
        path: "analytics",
        element: S(Analytics),
      },


      {
        path: "bootcamps",
        element: S(AdminBootcamp),
      },


      {
        path: "bootcamps/manage", // Use this for "Create New"
        element: S(AdminBootcampManagement),
      },
      {
        path: "bootcamps/manage/:id", // Use this for "Edit Existing"
        element: S(AdminBootcampUpdate),
      },
      {
        path: "coupons",
        element: S(AdminCoupons),
      },
      {
        path: "settings",
        element: S(AdminSettings),
      },
    ],
  },

  // Protected Classroom Routes
  {
    path: "/classroom",
    element: (
      <ProtectedRoute>
        <SuspenseWrapper>
          <MainLayout />
        </SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: S(ClassroomPage),
      },
      {
        path: "course/:courseId",
        element: S(LearningPage),
      },
      {
        path: "course/:courseId/lecture/:lectureId",
        element: S(LecturePage),
      },
    ],
  },
]);