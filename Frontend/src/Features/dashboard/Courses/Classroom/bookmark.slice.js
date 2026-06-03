import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  addBookmarkAPI,
  getBookmarksAPI,
  removeBookmarkAPI,
} from "../Classroom/service/bookmark.api";

// ================= ADD BOOKMARK =================
export const addBookmark =
  createAsyncThunk(
    "bookmark/addBookmark",
    async (data, thunkAPI) => {
      try {
        return await addBookmarkAPI(data);
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to add bookmark"
        );
      }
    }
  );

// ================= GET BOOKMARKS =================
export const getBookmarks =
  createAsyncThunk(
    "bookmark/getBookmarks",
    async (_, thunkAPI) => {
      try {
        return await getBookmarksAPI();
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to fetch bookmarks"
        );
      }
    }
  );

// ================= REMOVE BOOKMARK =================
export const removeBookmark =
  createAsyncThunk(
    "bookmark/removeBookmark",
    async (lessonId, thunkAPI) => {
      try {
        await removeBookmarkAPI(
          lessonId
        );

        return lessonId;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
            "Failed to remove bookmark"
        );
      }
    }
  );

const bookmarkSlice = createSlice({
  name: "bookmark",

  initialState: {
    bookmarks: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(
        getBookmarks.pending,
        (state) => {
          state.loading = true;
        }
      )
      .addCase(
        getBookmarks.fulfilled,
        (state, action) => {
          state.loading = false;
          state.bookmarks =
            action.payload.bookmarks;
        }
      )
      .addCase(
        getBookmarks.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ADD
      .addCase(
        addBookmark.fulfilled,
        (state, action) => {
          state.bookmarks.unshift(
            action.payload.bookmark
          );
        }
      )

      // REMOVE
      .addCase(
        removeBookmark.fulfilled,
        (state, action) => {
          state.bookmarks =
            state.bookmarks.filter(
              (bookmark) =>
                bookmark.lesson._id !==
                action.payload
            );
        }
      );
  },
});

export default bookmarkSlice.reducer;