import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCourseDetailAPI, getCourseByIdAPI } from "./services/courseDetail.api";

// ================= FETCH COURSE DETAIL =================
export const fetchCourseDetail = createAsyncThunk(
  "courseDetail/fetchCourseDetail",
  async (courseId, thunkAPI) => {
    try {
      return await getCourseDetailAPI(courseId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch course details"
      );
    }
  }
);

// ================= FETCH COURSE BY ID =================
export const fetchCourseById = createAsyncThunk(
  "courseDetail/fetchCourseById",
  async (courseId, thunkAPI) => {
    try {
      return await getCourseByIdAPI(courseId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch course"
      );
    }
  }
);

// ================= SLICE =================
const courseDetailSlice = createSlice({
  name: "courseDetail",

  initialState: {
    course: null,
    modules: [],
    lessons: [],
    loading: false,
    error: null,
  },

  reducers: {
    clearCourseDetail: (state) => {
      state.course = null;
      state.modules = [];
      state.lessons = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // FETCH COURSE DETAIL
      .addCase(fetchCourseDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload.course;
        state.modules = action.payload.modules || [];
        state.lessons = action.payload.lessons || [];
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH COURSE BY ID
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.course = action.payload.course;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCourseDetail } = courseDetailSlice.actions;
export default courseDetailSlice.reducer;
