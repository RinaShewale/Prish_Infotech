import API from "../../../../auth/services/api";



// SAVE PROGRESS
export const saveLessonProgressAPI = async (
  data
) => {
  const res = await API.post(
    "/lesson-progress/save",
    data
  );

  return res.data;
};



// GET PROGRESS
export const getLessonProgressAPI = async (
  lessonId
) => {
  const res = await API.get(
    `/lesson-progress/${lessonId}`
  );

  return res.data;
};