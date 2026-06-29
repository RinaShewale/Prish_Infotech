import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getMyEnrollmentsAPI,
  getAllEnrollmentsAPI,
  enrollCourseAPI,
} from "../services/entrollment.api";

// ======================================================
// 📚 GET MY ENROLLMENTS
// ======================================================
export const getMyEnrollments = createAsyncThunk(
  "enrollment/getMyEnrollments",
  async (_, thunkAPI) => {
    try {
      return await getMyEnrollmentsAPI();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Failed to fetch enrollments"
      );
    }
  }
);

// ======================================================
// 📚 GET ALL ENROLLMENTS (ADMIN)
// ======================================================
export const getAllEnrollments =
  createAsyncThunk(
    "enrollment/getAllEnrollments",
    async (_, thunkAPI) => {
      try {
        return await getAllEnrollmentsAPI();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch enrollments"
        );
      }
    }
  );

// ======================================================
// 🎓 ENROLL COURSE
// ======================================================
export const enrollCourse = createAsyncThunk(
  "enrollment/enrollCourse",
  async ({ courseId }, thunkAPI) => {
    try {
      return await enrollCourseAPI(courseId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          "Enrollment failed"
      );
    }
  }
);

// ======================================================
// 🧠 SLICE
// ======================================================
const enrollmentSlice = createSlice({
  name: "enrollment",

  initialState: {
    enrollments: [],
    loading: false,
    error: null,
    success: false,
    loaded: false,
  },

  reducers: {
    clearEnrollmentState: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==========================
      // GET MY ENROLLMENTS
      // ==========================
      .addCase(
        getMyEnrollments.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        getMyEnrollments.fulfilled,
        (state, action) => {
          state.loading = false;
          state.loaded = true;
          state.enrollments =
            action.payload.enrollments || [];
        }
      )
      .addCase(
        getMyEnrollments.rejected,
        (state, action) => {
          state.loading = false;
          state.loaded = true;
          state.error = action.payload;
        }
      )

      // ==========================
      // GET ALL ENROLLMENTS
      // ==========================
      .addCase(
        getAllEnrollments.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        getAllEnrollments.fulfilled,
        (state, action) => {
          state.loading = false;
          state.loaded = true;
          state.enrollments =
            action.payload.enrollments || [];
        }
      )
      .addCase(
        getAllEnrollments.rejected,
        (state, action) => {
          state.loading = false;
          state.loaded = true;
          state.error = action.payload;
        }
      )

      // ==========================
      // ENROLL COURSE
      // ==========================
      .addCase(
        enrollCourse.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        enrollCourse.fulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;

          if (
            action.payload?.enrollment
          ) {
            state.enrollments.push(
              action.payload.enrollment
            );
          }
        }
      )
      .addCase(
        enrollCourse.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const {
  clearEnrollmentState,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;