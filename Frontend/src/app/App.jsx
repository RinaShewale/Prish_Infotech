import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";

import { router } from "./AppRouter";
import { getme } from "../Features/auth/services/auth.api";
import { setUser, setAuthChecked } from "../Features/auth/redux/auth.slice";
import { useAuthInit } from "../Features/auth/hooks/useAuthInit";
import { getMyEnrollments } from "../Features/dashboard/Courses/redux/enrollment.slice";

const App = () => {
  useAuthInit();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getme();

        if (res.data?.user) {
          dispatch(setUser(res.data.user));

          // ✅ FIX: no await (prevents blocking + race issue)
          dispatch(getMyEnrollments());
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        dispatch(setUser(null));
      } finally {
        dispatch(setAuthChecked(true));
      }
    };

    loadUser();
  }, [dispatch]);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;