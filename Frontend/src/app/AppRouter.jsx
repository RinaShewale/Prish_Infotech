import { createBrowserRouter } from "react-router-dom";
import HomePage from "../Features/dashboard/Pages/HomePage";



export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    }
]);