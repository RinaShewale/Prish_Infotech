import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Features/dashboard/Home/Pages/HomePage";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    }
]);