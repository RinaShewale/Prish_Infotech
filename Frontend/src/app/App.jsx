import { useEffect, useRef, useState } from "react";
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
  const lenisRef = useRef(null);
  const [isNavigating, setIsNavigating] = useState(false);

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
      lenisRef.current?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      document.querySelectorAll("main, [data-scroll-container]").forEach(element => {
        element.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    };

    resetScroll();
    let previousLocationKey = router.state.location.key;
    let revealFrame;
    const unsubscribe = router.subscribe(state => {
      if (state.navigation.state !== "idle") {
        cancelAnimationFrame(revealFrame);
        setIsNavigating(true);
        return;
      }

      if (state.location.key === previousLocationKey) return;

      previousLocationKey = state.location.key;
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = window.requestAnimationFrame(() => {
          resetScroll();
          setIsNavigating(false);
        });
      });
    });

    return () => {
      cancelAnimationFrame(revealFrame);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;
    let animationFrame;

    const animate = time => {
      lenis.raf(time);
      animationFrame = window.requestAnimationFrame(animate);
    };

    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      {isNavigating && (
        <div
          className="fixed inset-0 z-[9999] bg-bg"
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default App;