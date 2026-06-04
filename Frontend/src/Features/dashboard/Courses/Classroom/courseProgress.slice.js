import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCourseProgressAPI } from "./service/courseProgress.api";

// ================= FETCH COURSE PROGRESS =================
export const fetchCourseProgress = createAsyncThunk(
  "courseProgress/fetchCourseProgress",
  async (courseId, thunkAPI) => {
    try {
      const res = await getCourseProgressAPI(courseId);

      // ✅ SAFE PARSING (backend structure fixed)
      const progressObj = res?.progress || res?.data?.progress || res;

      return progressObj; // FULL OBJECT RETURN करतोय आता
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch course progress"
      );
    }
  }
);

// ================= SLICE =================
const courseProgressSlice = createSlice({
  name: "courseProgress",
  initialState: {
    progress: 0,
    courseProgressData: null, // ⭐ NEW (important)
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseProgress.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ store full object
        state.courseProgressData = action.payload;

        // also store percentage separately
        state.progress = action.payload?.progress || 0;
      })
      .addCase(fetchCourseProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseProgressSlice.reducer;