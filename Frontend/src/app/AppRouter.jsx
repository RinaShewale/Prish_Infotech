import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Features/dashboard/Home/Pages/HomePage";
import CoursesPage from "../Features/dashboard/Courses/page/CoursePage";
import BootcampPage from "../Features/dashboard/Courses/page/BootcampPage";
import { RequestCallback } from "../Features/auth/pages/RequestCallback";
import { Login } from "../Features/auth/pages/Login";
import { Register } from "../Features/auth/pages/Register";
import { CourseDetailPage } from "../Features/dashboard/Courses/page/CoursesDetailPage";





export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/courses",
        element: <CoursesPage />
    },

     {
        path: "/bootcamp",
        element: <BootcampPage />
    },

    {
        path: "/callback",
        element: <RequestCallback />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/cohort/:slug",
        element: <CourseDetailPage />
    }
]);