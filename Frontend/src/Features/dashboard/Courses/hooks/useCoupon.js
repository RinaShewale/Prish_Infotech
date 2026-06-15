import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  validateCoupon,
  resetCoupon,
} from "../redux/coupon.slice";

export const useCoupon = () => {

  const dispatch =
    useDispatch();

  const coupon =
    useSelector(
      (state) => state.coupon
    );

  const handleValidateCoupon =
    async (data) => {

      const result =
        await dispatch(
          validateCoupon(data)
        );

      return result;
    };

  const handleResetCoupon =
    () => {

      dispatch(resetCoupon());
    };

  return {
    ...coupon,
    handleValidateCoupon,
    handleResetCoupon,
  };
};