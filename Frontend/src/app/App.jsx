import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useDispatch } from "react-redux";

import { router } from "./AppRouter";
import { getme } from "../Features/auth/services/auth.api";
import { setUser, setAuthChecked } from "../Features/auth/redux/auth.slice";
import { useAuthInit } from "../Features/auth/hooks/useAuthInit";
import { getMyEnrollments } from "../Features/dashboard/Courses/redux/enrollment.slice";
import Lenis from "lenis";

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

    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.querySelectorAll("main, [data-scroll-container]").forEach(element => {
        element.scrollTop = 0;
        element.scrollLeft = 0;
      });
    };

    resetScroll();
    let previousLocationKey = router.state.location.key;
    const unsubscribe = router.subscribe(state => {
      if (state.navigation.state !== "idle" || state.location.key === previousLocationKey) {
        return;
      }

      previousLocationKey = state.location.key;
      resetScroll();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    let animationFrame;

    const animate = time => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  return <RouterProvider router={router} />;
};

export default App;