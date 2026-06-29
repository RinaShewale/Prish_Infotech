import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  getMyEnrollments,
  getAllEnrollments,
  enrollCourse,
  clearEnrollmentState,
} from "../redux/enrollment.slice";

export const useEnrollment = () => {
  const dispatch = useDispatch();

  const {
    enrollments,
    loading,
    error,
    success,
    loaded,
  } = useSelector(
    (state) => state.enrollment
  );

  // USER ENROLLMENTS
  const fetchMyEnrollments = () => {
    dispatch(getMyEnrollments());
  };

  // ADMIN ENROLLMENTS
  const fetchEnrollments = () => {
    dispatch(getAllEnrollments());
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
    loaded,

    fetchMyEnrollments,
    fetchEnrollments,
    handleEnroll,
    clearState,
  };
};