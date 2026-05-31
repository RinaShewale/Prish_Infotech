import { useDispatch, useSelector }
from "react-redux";

import { fetchLessons }
from "../lesson.slice";



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
  const getLessons = async (
    courseId
  ) => {

    await dispatch(
      fetchLessons(courseId)
    );
  };



  return {
    lessons,
    loading,
    error,
    getLessons,
  };
};