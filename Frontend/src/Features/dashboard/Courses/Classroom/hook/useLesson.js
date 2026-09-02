import { useCallback } from "react";
import { useDispatch, useSelector }
from "react-redux";

import { fetchLessons }
from "../../Classroom/redux/lesson.slice";



export const useLesson = () => {

  const dispatch = useDispatch();

  const {
    lessons,
    loading,
    error,
  } = useSelector(
    (state) => state.lesson
  );



  // ================= FETCH =================
  const getLessons = useCallback(async (
    courseId
  ) => {

    await dispatch(
      fetchLessons(courseId)
    );
  }, [dispatch]);



  return {
    lessons,
    loading,
    error,
    getLessons,
  };
};