import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getCourseLessonsAPI,
} from "../service/lesson.api";



// ================= FETCH LESSONS =================
export const fetchLessons = createAsyncThunk(
  "lesson/fetchLessons",

  async (courseId, thunkAPI) => {

    try {

      return await getCourseLessonsAPI(
        courseId
      );

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message
      );
    }
  }
);



// ================= SLICE =================
const lessonSlice = createSlice({
  name: "lesson",

  initialState: {
    lessons: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {

    builder

      // FETCH LESSONS
      .addCase(
        fetchLessons.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchLessons.fulfilled,
        (state, action) => {

          state.loading = false;
          state.lessons =
            action.payload.lessons;
        }
      )

      .addCase(
        fetchLessons.rejected,
        (state, action) => {

          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default lessonSlice.reducer;