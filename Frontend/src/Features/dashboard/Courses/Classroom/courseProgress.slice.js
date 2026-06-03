import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCourseProgressAPI } from "./service/courseProgress.api";

export const fetchCourseProgress = createAsyncThunk(
  "courseProgress/fetchCourseProgress",
  async (courseId, thunkAPI) => {
    try {
      const res = await getCourseProgressAPI(courseId);
      
      // LOGIC: Based on your schema, the API returns a CourseProgress object
      // We look for res.progress (the object) then .progress (the number)
      // Or if the API returns the object directly as res.data
      const progressData = res.progress || res;
      const actualPercentage = typeof progressData === 'object' ? progressData.progress : progressData;

      return actualPercentage ?? 0;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
    }
  }
);

const courseProgressSlice = createSlice({
  name: "courseProgress",
  initialState: { progress: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseProgress.pending, (state) => { state.loading = true; })
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progress = action.payload;
      })
      .addCase(fetchCourseProgress.rejected, (state) => { state.loading = false; });
  },
});

export default courseProgressSlice.reducer;