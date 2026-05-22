import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";

import { router } from "./AppRouter";
import { getme } from "../Features/auth/services/auth.api";
import { setUser, setAuthChecked } from "../Features/auth/auth.slice";
import { useAuthInit } from "../Features/auth/hooks/useAuthInit";

const App = () => {
  useAuthInit();
  const dispatch = useDispatch();

  /* =========================
     AUTH CHECK ON APP LOAD
  ========================= */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getme();

        if (res.data?.user) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        dispatch(setUser(null));
      } finally {
        // 🔥 VERY IMPORTANT: tells app auth check is done
        dispatch(setAuthChecked(true));
      }
    };

    loadUser();
  }, [dispatch]);

  /* =========================
     SCROLL FIX (UI UX)
  ========================= */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return <RouterProvider router={router} />;
};

export default App;