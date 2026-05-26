import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  validateCouponAPI,
} from "./services/coupon.api";

export const validateCoupon =
  createAsyncThunk(
    "coupon/validate",

    async (
      couponData,
      thunkAPI
    ) => {

      try {

        return await validateCouponAPI(
          couponData
        );

      } catch (error) {

        return thunkAPI.rejectWithValue(
          error.response.data.message
        );
      }
    }
  );

const couponSlice =
  createSlice({
    name: "coupon",

    initialState: {
      loading: false,
      coupon: null,
      discount: 0,
      success: false,
      error: null,
    },

    reducers: {

      resetCoupon: (state) => {

        state.loading = false;

        state.coupon = null;

        state.discount = 0;

        state.success = false;

        state.error = null;
      },
    },

    extraReducers: (builder) => {

      builder

        .addCase(
          validateCoupon.pending,
          (state) => {

            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          validateCoupon.fulfilled,
          (state, action) => {

            state.loading = false;

            state.success = true;

            state.discount =
              action.payload.discount;

            state.coupon =
              action.payload.coupon;
          }
        )

        .addCase(
          validateCoupon.rejected,
          (state, action) => {

            state.loading = false;

            state.success = false;

            state.error =
              action.payload;
          }
        );
    },
  });

export const {
  resetCoupon,
} = couponSlice.actions;

export default couponSlice.reducer;