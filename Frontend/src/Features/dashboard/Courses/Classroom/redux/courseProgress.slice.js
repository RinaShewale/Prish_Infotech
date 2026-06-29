import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import { getCourseProgressAPI } from "../service/courseProgress.api";

// ================= FETCH COURSE PROGRESS =================
export const fetchCourseProgress =
  createAsyncThunk(
    "courseProgress/fetchCourseProgress",
    async (courseId, thunkAPI) => {
      try {
        const res =
          await getCourseProgressAPI(courseId);

        // backend returns: { success: true, progress: {...} }
        const data = res?.progress;

        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch course progress"
        );
      }
    }
  );

// ================= SLICE =================
const courseProgressSlice = createSlice({
  name: "courseProgress",

  initialState: {
    progress: 0,
    courseProgressData: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearCourseProgress: (state) => {
      state.progress = 0;
      state.courseProgressData = null;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= LOADING =================
      .addCase(
        fetchCourseProgress.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      // ================= SUCCESS =================
      .addCase(
        fetchCourseProgress.fulfilled,
        (state, action) => {
          state.loading = false;

          state.courseProgressData =
            action.payload;

          state.progress =
            action.payload?.progress || 0;
        }
      )

      // ================= ERROR =================
      .addCase(
        fetchCourseProgress.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearCourseProgress,
} = courseProgressSlice.actions;

export default courseProgressSlice.reducer;