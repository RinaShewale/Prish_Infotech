import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchLeaderboard,
  fetchTopUsers,
} from "../leaderboard.slice";

export const useLeaderboard =
  () => {

    const dispatch =
      useDispatch();

    const {
      users,
      topUsers,
      loading,
      error,
    } = useSelector(
      (state) =>
        state.leaderboard
    );

    // ================= GET LEADERBOARD =================
    const getLeaderboard =
      async (
        courseId
      ) => {

        try {

          await dispatch(
            fetchLeaderboard(
              courseId
            )
          );

        } catch (error) {

          console.log(
            "Leaderboard Error:",
            error
          );
        }
      };

    // ================= GET TOP USERS =================
    const getTopUsers =
      async (
        courseId,
        limit = 10
      ) => {

        try {

          await dispatch(
            fetchTopUsers({
              courseId,
              limit,
            })
          );

        } catch (error) {

          console.log(
            "Top Users Error:",
            error
          );
        }
      };

    return {
      users,
      topUsers,
      loading,
      error,
      getLeaderboard,
      getTopUsers,
    };
  };