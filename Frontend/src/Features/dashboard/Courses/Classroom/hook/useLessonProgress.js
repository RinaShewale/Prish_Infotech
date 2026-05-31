import {
  saveLessonProgressAPI,
  getLessonProgressAPI,
} from "../service/lessonProgress.api";

export const useLessonProgress = () => {

  // ================= SAVE =================
  const saveProgress = async (data) => {

    try {

      return await saveLessonProgressAPI(
        data
      );

    } catch (error) {

      console.log(
        "Save Progress Error:",
        error
      );
    }
  };



  // ================= GET =================
  const getProgress = async (
    lessonId
  ) => {

    try {

      return await getLessonProgressAPI(
        lessonId
      );

    } catch (error) {

      console.log(
        "Get Progress Error:",
        error
      );
    }
  };



  return {
    saveProgress,
    getProgress,
  };
};