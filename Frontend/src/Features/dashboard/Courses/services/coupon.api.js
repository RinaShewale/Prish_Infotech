import API from "../../../auth/services/api";

export const validateCouponAPI =
  async (data) => {

    const response =
      await API.post(
        "/coupon/validate",
        data
      );

    return response.data;
  };