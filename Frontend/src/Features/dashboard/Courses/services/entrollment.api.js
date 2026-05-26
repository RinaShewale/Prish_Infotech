import API from "../../../auth/services/api";

// ======================================================
// 📚 GET MY ENROLLMENTS
// ======================================================

export const getMyEnrollmentsAPI =
  async () => {
    const response = await API.get(
      "/enrollment/my-enrollments"
    );

    return response.data;
  };

// ======================================================
// 🎓 ENROLL COURSE
// ======================================================

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