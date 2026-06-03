import API from "../../../../auth/services/api";

// ================= GET COURSE LEADERBOARD =================
export const getLeaderboardAPI = async (
  courseId
) => {

  const { data } = await API.get(
    `/leaderboard/course/${courseId}`
  );

  return data;
};


// ================= GET TOP USERS =================
export const getTopUsersAPI = async (
  courseId,
  limit = 10
) => {

  const { data } = await API.get(
    `/leaderboard/top?courseId=${courseId}&limit=${limit}`
  );

  return data;
};