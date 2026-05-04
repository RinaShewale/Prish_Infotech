import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./AppRouter"; // correct path

const App = () => {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <RouterProvider router={router} />
  )
}


export default App