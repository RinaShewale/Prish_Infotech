// ======================================================
// 📁 redux/slices/certificateSlice.js
// ======================================================

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCertificateApi,
  getAllCertificatesApi,
  getMyCertificatesApi,
  getCertificateByIdApi,
  deleteCertificateApi,
} from "../services/certificat.api";

// ================= THUNKS =================

export const createCertificate = createAsyncThunk(
  "certificate/create",
  async (data, thunkAPI) => {
    try {
      return await createCertificateApi(data);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchAllCertificates = createAsyncThunk(
  "certificate/all",
  async (_, thunkAPI) => {
    try {
      return await getAllCertificatesApi();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchMyCertificates = createAsyncThunk(
  "certificate/me",
  async (_, thunkAPI) => {
    try {
      return await getMyCertificatesApi();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const fetchCertificateById = createAsyncThunk(
  "certificate/single",
  async (id, thunkAPI) => {
    try {
      return await getCertificateByIdApi(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

export const removeCertificate = createAsyncThunk(
  "certificate/delete",
  async (id, thunkAPI) => {
    try {
      return await deleteCertificateApi(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// ================= SLICE =================

const certificateSlice = createSlice({
  name: "certificate",
  initialState: {
    certificates: [],
    myCertificates: [],
    selectedCertificate: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearCertificateState: (state) => {
      state.error = null;
      state.selectedCertificate = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(createCertificate.fulfilled, (state, action) => {
        state.certificates.push(action.payload.certificate);
      })

      // ALL
      .addCase(fetchAllCertificates.fulfilled, (state, action) => {
        state.certificates = action.payload.certificates;
      })

      // ME
      .addCase(fetchMyCertificates.fulfilled, (state, action) => {
        state.myCertificates = action.payload.certificates;
      })

      // SINGLE
      .addCase(fetchCertificateById.fulfilled, (state, action) => {
        state.selectedCertificate = action.payload.certificate;
      })

      // DELETE
      .addCase(removeCertificate.fulfilled, (state, action) => {
        state.certificates = state.certificates.filter(
          (c) => c._id !== action.meta.arg
        );
        state.myCertificates = state.myCertificates.filter(
          (c) => c._id !== action.meta.arg
        );
      });
  },
});

export const { clearCertificateState } = certificateSlice.actions;
export default certificateSlice.reducer;