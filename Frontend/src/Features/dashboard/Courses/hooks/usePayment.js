import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment } from "../payment.slice";

export const usePayment = () => {
  const dispatch = useDispatch();

  const payment = useSelector((state) => state.payment);

  // =========================
  // CREATE ORDER
  // =========================
  const handleCreateOrder = async (data) => {
    try {
      const result = await dispatch(createOrder(data));

      if (createOrder.fulfilled.match(result)) {
        return result.payload;
      }

      throw new Error(result.payload || "Order failed");
    } catch (error) {
      console.log("Create Order Error:", error);
      return null;
    }
  };

  // =========================
  // VERIFY PAYMENT
  // =========================
  const handleVerifyPayment = async (data) => {
    try {
      const result = await dispatch(verifyPayment(data));

      if (verifyPayment.fulfilled.match(result)) {
        return result.payload;
      }

      throw new Error(result.payload || "Payment verification failed");
    } catch (error) {
      console.log("Verify Payment Error:", error);
      return null;
    }
  };

  return {
    ...payment,
    handleCreateOrder,
    handleVerifyPayment,
  };
};