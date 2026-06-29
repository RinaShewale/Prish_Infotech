import API from "../../../auth/services/api";

// USER ENROLLMENTS
export const getMyEnrollmentsAPI = async () => {
  const response = await API.get(
    "/enrollment/my-enrollments"
  );

  return response.data;
};

// ADMIN ENROLLMENTS
export const getAllEnrollmentsAPI = async () => {
  const response = await API.get(
    "/enrollment/admin/enrollments"
  );

  return response.data;
};

// ENROLL COURSE
export const enrollCourseAPI = async (
  courseId
) => {
  const response = await API.post(
    "/enrollment/enroll",
    {
      courseId,
    }
  );

  return response.data;
};