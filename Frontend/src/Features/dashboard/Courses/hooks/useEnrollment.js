import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  enrollCourse,
  getMyEnrollments,
  clearEnrollmentState,
} from "../enrollment.slice";

export const useEnrollment = () => {
  const dispatch = useDispatch();

  const {
    enrollments,
    loading,
    error,
    success,
  } = useSelector(
    (state) => state.enrollment
  );

  // GET ENROLLMENTS
  const fetchEnrollments = () => {
    dispatch(getMyEnrollments());
  };

  // ENROLL COURSE
  const handleEnroll = (courseId) => {
    dispatch(
      enrollCourse({ courseId })
    );
  };

  // CLEAR STATE
  const clearState = () => {
    dispatch(clearEnrollmentState());
  };

  return {
    enrollments,
    loading,
    error,
    success,

    fetchEnrollments,
    handleEnroll,
    clearState,
  };
};