import { useDispatch } from "react-redux";

import {
  addBookmark,
  removeBookmark,
} from "../redux/bookmark.slice";

const useBookmark = () => {
  const dispatch = useDispatch();

  const bookmarkLesson = async (
    courseId,
    lessonId
  ) => {
    await dispatch(
      addBookmark({
        courseId,
        lessonId,
      })
    ).unwrap();
  };

  const unbookmarkLesson =
    async (lessonId) => {
      await dispatch(
        removeBookmark(lessonId)
      ).unwrap();
    };

  return {
    bookmarkLesson,
    unbookmarkLesson,
  };
};

export default useBookmark;