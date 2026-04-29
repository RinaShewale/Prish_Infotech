import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Features/dashboard/Home/Pages/HomePage";
import CoursesPage from "../Features/dashboard/Courses/page/CoursePage";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/courses",
        element: <CoursesPage />
    }
]);