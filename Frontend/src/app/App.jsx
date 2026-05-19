import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";

import { router } from "./AppRouter";
import { getme } from "../Features/auth/services/auth.api"; // adjust path
import { setUser } from "../Features/auth/auth.slice"; // adjust path

const App = () => {
  const dispatch = useDispatch();

  // 🔥 FIX: load user on every refresh (VERY IMPORTANT for Google login)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getme();

        if (res.data?.user) {
          dispatch(setUser(res.data.user));
        }
      } catch (err) {
        console.log("No logged-in user");
      }
    };

    loadUser();
  }, [dispatch]);

  // scroll fix
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;