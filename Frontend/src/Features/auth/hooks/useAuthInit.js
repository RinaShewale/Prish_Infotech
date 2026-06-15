import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getme } from "../services/auth.api";
import { setUser, setAuthChecked } from "../redux/auth.slice";

export const useAuthInit = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await getme();

        // 🔥 only set if user exists
        if (res?.data?.user) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch (err) {
        // silent fail (token invalid / no login)
        dispatch(setUser(null));
      } finally {
        // 🔥 IMPORTANT: unlock UI
        dispatch(setAuthChecked(true));
      }
    };

    initAuth();
  }, [dispatch]);
};