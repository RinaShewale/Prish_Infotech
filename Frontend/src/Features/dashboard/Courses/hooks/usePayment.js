import { useDispatch, useSelector } from "react-redux";
import { createOrder, verifyPayment, getAllPayments } from "../redux/payment.slice";

export const usePayment = () => {
  const dispatch = useDispatch();
  const paymentState = useSelector((state) => state.payment);

  // FETCH ALL FOR ADMIN
  const fetchAllPayments = () => {
    dispatch(getAllPayments());
  };

  // CREATE ORDER
  const handleCreateOrder = async (data) => {
    try {
      const result = await dispatch(createOrder(data));
      if (createOrder.fulfilled.match(result)) return result.payload;
      return { success: false, message: result.payload };
    } catch (error) {
      return { success: false };
    }
  };

  // VERIFY PAYMENT
  const handleVerifyPayment = async (data) => {
    try {
      const result = await dispatch(verifyPayment(data));
      if (verifyPayment.fulfilled.match(result)) {
        return { success: true, ...result.payload };
      }
      return { success: false, message: result.payload || "Payment failed" };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return {
    ...paymentState, // includes allPayments, loading, error, etc.
    fetchAllPayments,
    handleCreateOrder,
    handleVerifyPayment,
  };
};