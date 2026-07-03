import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBootcampsAPI,
  fetchAdminBootcampsAPI,
  fetchBootcampByIdAPI,
  createBootcampAPI,
  updateBootcampAPI,
  deleteBootcampAPI,
} from "../services/bootcamp.api";

// --- THUNKS ---
export const fetchBootcamps = createAsyncThunk(
  "bootcamp/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBootcampsAPI();
      return data?.bootcamps || [];
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch bootcamps");
    }
  }
);

export const fetchAdminBootcamps = createAsyncThunk(
  "bootcamp/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAdminBootcampsAPI();
      return data?.bootcamps || []; // Extract the array from response
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch admin bootcamps");
    }
  }
);

export const fetchBootcampById = createAsyncThunk(
  "bootcamp/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchBootcampByIdAPI(id);
      return data?.bootcamp || null;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch bootcamp");
    }
  }
);

export const createBootcamp = createAsyncThunk(
  "bootcamp/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createBootcampAPI(payload);
      return data?.bootcamp || null;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to create bootcamp");
    }
  }
);

export const updateBootcamp = createAsyncThunk(
  "bootcamp/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await updateBootcampAPI(id, payload);
      return data?.bootcamp || null;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to update bootcamp");
    }
  }
);

export const deleteBootcamp = createAsyncThunk(
  "bootcamp/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBootcampAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to delete bootcamp");
    }
  }
);

// --- SLICE ---
const bootcampSlice = createSlice({
  name: "bootcamp",
  initialState: {
    bootcamps: [],
    bootcamp: null,
    loading: false,
    creating: false,
    fetchingOne: false,
    error: null,
  },
  reducers: {
    resetBootcampState: (state) => {
      state.bootcamp = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH ALL & FETCH ADMIN (Both update the bootcamps list)
      .addCase(fetchBootcamps.pending, (state) => { state.loading = true; })
      .addCase(fetchBootcamps.fulfilled, (state, action) => {
        state.loading = false;
        state.bootcamps = action.payload;
      })
      .addCase(fetchBootcamps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // THIS WAS MISSING IN YOUR CODE:
      .addCase(fetchAdminBootcamps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminBootcamps.fulfilled, (state, action) => {
        state.loading = false;
        state.bootcamps = action.payload; // Now state.bootcamps will populate!
      })
      .addCase(fetchAdminBootcamps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // FETCH ONE
      .addCase(fetchBootcampById.fulfilled, (state, action) => {
        state.fetchingOne = false;
        state.bootcamp = action.payload;
      })

      // CREATE
      .addCase(createBootcamp.fulfilled, (state, action) => {
        state.creating = false;
        if (action.payload) state.bootcamps.unshift(action.payload);
      })

      // UPDATE
      .addCase(updateBootcamp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.bootcamps = state.bootcamps.map(b => 
            b._id === action.payload._id ? action.payload : b
          );
        }
      })

      // DELETE
      .addCase(deleteBootcamp.fulfilled, (state, action) => {
        state.loading = false;
        state.bootcamps = state.bootcamps.filter(b => b._id !== action.payload);
      });
  },
});

export const { resetBootcampState } = bootcampSlice.actions;
export default bootcampSlice.reducer;