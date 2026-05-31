import API from "../../../../auth/services/api";



// ================= GET COURSE LESSONS =================
export const getCourseLessonsAPI = async (
  courseId
) => {

  const { data } = await API.get(
    `/lessons/course/${courseId}`
  );

  return data;
};



// ================= GET SINGLE LESSON =================
export const getSingleLessonAPI = async (
  lessonId
) => {

  const { data } = await API.get(
    `/lessons/${lessonId}`
  );

  return data;
};



// ================= CREATE LESSON =================
export const createLessonAPI = async (
  lessonData
) => {

  const { data } = await API.post(
    "/lessons/create",
    lessonData
  );

  return data;
};



// ================= UPDATE LESSON =================
export const updateLessonAPI = async (
  lessonId,
  lessonData
) => {

  const { data } = await API.put(
    `/lessons/${lessonId}`,
    lessonData
  );

  return data;
};



// ================= DELETE LESSON =================
export const deleteLessonAPI = async (
  lessonId
) => {

  const { data } = await API.delete(
    `/lessons/${lessonId}`
  );

  return data;
};