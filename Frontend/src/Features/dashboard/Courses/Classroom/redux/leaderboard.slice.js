import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getLeaderboardAPI,
  getTopUsersAPI,
} from "../service/leaderboard.api";


// ================= FETCH LEADERBOARD =================
export const fetchLeaderboard =
  createAsyncThunk(
    "leaderboard/fetchLeaderboard",

    async (
      courseId,
      thunkAPI
    ) => {

      try {

        return await getLeaderboardAPI(
          courseId
        );

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch leaderboard"
        );
      }
    }
  );


// ================= FETCH TOP USERS =================
export const fetchTopUsers =
  createAsyncThunk(
    "leaderboard/fetchTopUsers",

    async (
      { courseId, limit },
      thunkAPI
    ) => {

      try {

        return await getTopUsersAPI(
          courseId,
          limit
        );

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch top users"
        );
      }
    }
  );



const leaderboardSlice =
  createSlice({

    name: "leaderboard",

    initialState: {
      users: [],
      topUsers: [],
      loading: false,
      error: null,
    },

    reducers: {

      clearLeaderboard:
        (state) => {

          state.users = [];
          state.topUsers = [];
          state.error = null;
        },
    },

    extraReducers: (
      builder
    ) => {

      builder

        // LEADERBOARD
        .addCase(
          fetchLeaderboard.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchLeaderboard.fulfilled,
          (state, action) => {

            state.loading = false;
            state.users =
              action.payload.users || [];
          }
        )

        .addCase(
          fetchLeaderboard.rejected,
          (state, action) => {

            state.loading = false;
            state.error =
              action.payload;
          }
        )

        // TOP USERS
        .addCase(
          fetchTopUsers.pending,
          (state) => {

            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchTopUsers.fulfilled,
          (state, action) => {

            state.loading = false;
            state.topUsers =
              action.payload.users || [];
          }
        )

        .addCase(
          fetchTopUsers.rejected,
          (state, action) => {

            state.loading = false;
            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  clearLeaderboard,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;