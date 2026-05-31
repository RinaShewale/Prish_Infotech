import Problem from "../models/Problem.model.js";



// ================= CREATE PROBLEM =================
export const createProblem = async (
  req,
  res
) => {
  try {
    const problem =
      await Problem.create(req.body);

    res.status(201).json({
      success: true,
      problem,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ================= GET LESSON PROBLEMS =================
export const getProblemsByLesson =
  async (req, res) => {
    try {
      const problems =
        await Problem.find({
          lesson: req.params.lessonId,
        });

      res.status(200).json({
        success: true,
        problems,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };