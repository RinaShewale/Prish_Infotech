import { useDispatch, useSelector } from "react-redux";
import { fetchCourseDetail, fetchCourseById } from "../../courseDetail.slice";

export const useCourseDetail = () => {
  const dispatch = useDispatch();

  const { course, modules, lessons, loading, error } = useSelector(
    (state) => state.courseDetail
  );

  // ================= FETCH COURSE DETAIL =================
  const getCourseDetail = async (courseId) => {
    try {
      await dispatch(fetchCourseDetail(courseId));
    } catch (error) {
      console.log("Get Course Detail Error:", error);
    }
  };

  // ================= FETCH COURSE BY ID =================
  const getCourseById = async (courseId) => {
    try {
      await dispatch(fetchCourseById(courseId));
    } catch (error) {
      console.log("Get Course By ID Error:", error);
    }
  };

  return {
    course,
    modules,
    lessons,
    loading,
    error,
    getCourseDetail,
    getCourseById,
  };
};
