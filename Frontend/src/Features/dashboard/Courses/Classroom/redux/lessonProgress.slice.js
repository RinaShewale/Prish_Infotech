import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  saveLessonProgressAPI,
  getLessonProgressAPI,
} from "../service/lessonProgress.api";

// ================= SAVE LESSON PROGRESS =================
export const saveLessonProgress =
  createAsyncThunk(
    "lessonProgress/saveLessonProgress",
    async (progressData, thunkAPI) => {
      try {
        return await saveLessonProgressAPI(progressData);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to save progress"
        );
      }
    }
  );

// ================= GET LESSON PROGRESS =================
export const getLessonProgress =
  createAsyncThunk(
    "lessonProgress/getLessonProgress",
    async (lessonId, thunkAPI) => {
      try {
        return await getLessonProgressAPI(lessonId);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch progress"
        );
      }
    }
  );

// ================= SLICE =================
const lessonProgressSlice = createSlice({
  name: "lessonProgress",

  initialState: {
    progress: null,
    loading: false,
    error: null,
    saveLoading: false,
  },

  extraReducers: (builder) => {
    builder
      // SAVE PROGRESS
      .addCase(
        saveLessonProgress.pending,
        (state) => {
          state.saveLoading = true;
          state.error = null;
        }
      )
      .addCase(
        saveLessonProgress.fulfilled,
        (state, action) => {
          state.saveLoading = false;
          state.progress = action.payload.progress;
        }
      )
      .addCase(
        saveLessonProgress.rejected,
        (state, action) => {
          state.saveLoading = false;
          state.error = action.payload;
        }
      )

      // GET PROGRESS
      .addCase(
        getLessonProgress.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addCase(
        getLessonProgress.fulfilled,
        (state, action) => {
          state.loading = false;
          state.progress = action.payload.progress;
        }
      )
      .addCase(
        getLessonProgress.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default lessonProgressSlice.reducer;
