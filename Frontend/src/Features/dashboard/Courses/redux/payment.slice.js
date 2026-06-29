import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrderAPI, verifyPaymentAPI, fetchAllPaymentsAPI } from "../services/payment.api";

/**
 * 🔥 NEW: GET ALL PAYMENTS (ADMIN)
 */
export const getAllPayments = createAsyncThunk(
  "payment/getAllPayments",
  async (_, thunkAPI) => {
    try {
      const res = await fetchAllPaymentsAPI();
      return res.payments; // Assuming your backend returns { payments: [...] }
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch transactions"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (paymentData, thunkAPI) => {
    try {
      const res = await createOrderAPI(paymentData);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Order failed");
    }
  }
);

export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, thunkAPI) => {
    try {
      const res = await verifyPaymentAPI(paymentData);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data?.message || "Verification failed");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    allPayments: [], // 🔥 Stores the list for Admin
    order: null,
    success: false,
    error: null,
    paymentResult: null,
    enrolled: false,
  },
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.order = null;
      state.paymentResult = null;
      state.enrolled = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ================= GET ALL PAYMENTS (ADMIN) =================
      .addCase(getAllPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.allPayments = action.payload; // Data for your table
      })
      .addCase(getAllPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= CREATE ORDER =================
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload?.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= VERIFY =================
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.paymentResult = action.payload;
        state.enrolled = action.payload?.enrolled || false;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;