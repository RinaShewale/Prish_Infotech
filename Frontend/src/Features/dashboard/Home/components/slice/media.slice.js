import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMediaAPI } from "../api/media.api";

// 📤 FETCH MEDIA
export const fetchMedia = createAsyncThunk(
  "media/fetchMedia",
  async (_, thunkAPI) => {
    try {
      const res = await getMediaAPI();
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const mediaSlice = createSlice({
  name: "media",
  initialState: {
    media: null,
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMedia.fulfilled, (state, action) => {
        state.loading = false;
        state.media = action.payload;
      })
      .addCase(fetchMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mediaSlice.reducer;