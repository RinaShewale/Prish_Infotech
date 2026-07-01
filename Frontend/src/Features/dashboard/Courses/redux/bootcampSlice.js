import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchBootcampsAPI,
  fetchAdminBootcampsAPI,
  fetchBootcampByIdAPI,
  createBootcampAPI,
  updateBootcampAPI,
  deleteBootcampAPI,
} from "../services/bootcamp.api";

// ======================
// FETCH ALL
// ======================
export const fetchBootcamps = createAsyncThunk(
  "bootcamp/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchBootcampsAPI();
      return data?.bootcamps || [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch bootcamps"
      );
    }
  }
);

// ======================
// FETCH ADMIN
// ======================
export const fetchAdminBootcamps = createAsyncThunk(
  "bootcamp/fetchAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchAdminBootcampsAPI();
      return data?.bootcamps || [];
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch admin bootcamps"
      );
    }
  }
);

// ======================
// FETCH ONE
// ======================
export const fetchBootcampById = createAsyncThunk(
  "bootcamp/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const data = await fetchBootcampByIdAPI(id);
      return data?.bootcamp || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to fetch bootcamp"
      );
    }
  }
);

// ======================
// CREATE
// ======================
export const createBootcamp = createAsyncThunk(
  "bootcamp/create",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await createBootcampAPI(payload);
      return data?.bootcamp || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to create bootcamp"
      );
    }
  }
);

// ======================
// UPDATE
// ======================
export const updateBootcamp = createAsyncThunk(
  "bootcamp/update",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const data = await updateBootcampAPI(id, payload);
      return data?.bootcamp || null;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to update bootcamp"
      );
    }
  }
);

// ======================
// DELETE
// ======================
export const deleteBootcamp = createAsyncThunk(
  "bootcamp/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteBootcampAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || "Failed to delete bootcamp"
      );
    }
  }
);

// ======================
// SLICE
// ======================
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
      state.fetchingOne = false;
      state.creating = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ======================
      // FETCH ALL
      // ======================
      .addCase(fetchBootcamps.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBootcamps.fulfilled, (state, action) => {
        state.loading = false;
        state.bootcamps = action.payload;
        state.error = null;
      })
      .addCase(fetchBootcamps.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // FETCH ONE
      // ======================
      .addCase(fetchBootcampById.pending, (state) => {
        state.fetchingOne = true;
        state.error = null;
      })
      .addCase(fetchBootcampById.fulfilled, (state, action) => {
        
        state.fetchingOne = false;
        state.bootcamp = action.payload;
        state.error = null;
      })
      .addCase(fetchBootcampById.rejected, (state, action) => {
        state.fetchingOne = false;
        state.error = action.payload;
      })

      // ======================
      // CREATE
      // ======================
      .addCase(createBootcamp.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createBootcamp.fulfilled, (state, action) => {
        state.creating = false;

        if (action.payload) {
          const exists = state.bootcamps.some(
            (b) => b._id === action.payload._id
          );

          if (!exists) {
            state.bootcamps = [action.payload, ...state.bootcamps];
          }
        }

        state.error = null;
      })
      .addCase(createBootcamp.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // ======================
      // UPDATE
      // ======================
      .addCase(updateBootcamp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBootcamp.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.bootcamps = state.bootcamps.map((bootcamp) =>
            bootcamp._id === action.payload._id ? action.payload : bootcamp
          );
        }
        state.error = null;
      })
      .addCase(updateBootcamp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ======================
      // DELETE
      // ======================
      .addCase(deleteBootcamp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBootcamp.fulfilled, (state, action) => {
        state.loading = false;
        state.bootcamps = state.bootcamps.filter(
          (bootcamp) => bootcamp._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteBootcamp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBootcampState } = bootcampSlice.actions;
export default bootcampSlice.reducer;