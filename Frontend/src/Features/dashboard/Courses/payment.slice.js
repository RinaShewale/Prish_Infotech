import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  createOrderAPI,
  verifyPaymentAPI,
} from "./services/payment.api";

/**
 * =========================
 * CREATE ORDER
 * =========================
 */
export const createOrder = createAsyncThunk(
  "payment/createOrder",
  async (paymentData, thunkAPI) => {
    try {
      const res = await createOrderAPI(paymentData);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Order failed"
      );
    }
  }
);

/**
 * =========================
 * VERIFY PAYMENT
 * =========================
 */
export const verifyPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData, thunkAPI) => {
    try {
      const res = await verifyPaymentAPI(paymentData);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Payment verification failed"
      );
    }
  }
);

/**
 * =========================
 * SLICE
 * =========================
 */
const paymentSlice = createSlice({
  name: "payment",

  initialState: {
    loading: false,
    order: null,
    success: false,
    error: null,

    // 🔥 IMPORTANT FIX (ADD THIS)
    paymentResult: null,
    enrolled: false,
  },

  reducers: {
    // 🔥 RESET AFTER PAYMENT (IMPORTANT)
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

      // ================= ORDER =================
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

        // 🔥 IMPORTANT FIX
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