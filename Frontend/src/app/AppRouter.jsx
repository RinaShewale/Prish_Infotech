import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Features/dashboard/Home/Pages/HomePage";
import CoursesPage from "../Features/dashboard/Courses/page/CoursePage";
import BootcampPage from "../Features/dashboard/Courses/page/BootcampPage";
import { RequestCallback } from "../Features/auth/pages/RequestCallback";
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
        path: "/cohort/:slug",
        element: <CourseDetailPage />
        }
]);