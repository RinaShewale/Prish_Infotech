import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment } from "../redux/payment.slice";

export const usePayment = () => {
  const dispatch = useDispatch();

  const payment = useSelector((state) => state.payment);

  // CREATE ORDER
  const handleCreateOrder = async (data) => {
    try {
      const result = await dispatch(createOrder(data));

      if (createOrder.fulfilled.match(result)) {
        return result.payload;
      }

      return { success: false, message: result.payload };
    } catch (error) {
      console.log("Create Order Error:", error);
      return { success: false };
    }
  };

  // VERIFY PAYMENT (🔥 FIXED)
  const handleVerifyPayment = async (data) => {
    try {
      const result = await dispatch(verifyPayment(data));

      if (verifyPayment.fulfilled.match(result)) {
        return {
          success: true,
          ...result.payload,
        };
      }

      return {
        success: false,
        message: result.payload || "Payment failed",
      };
    } catch (error) {
      console.log("Verify Payment Error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  };

  return {
    ...payment,
    handleCreateOrder,
    handleVerifyPayment,
  };
};