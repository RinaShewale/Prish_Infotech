import API from "../../../auth/services/api";

export const createOrderAPI = async (data) => {
    const response = await API.post("/payment/create-order", data);
    return response.data;
};

export const verifyPaymentAPI = async (data) => {
    const response = await API.post("/payment/verify", data);
    return response.data;
};

// 🔥 NEW: Fetch all payments for Admin
export const fetchAllPaymentsAPI = async () => {
    const response = await API.get("/payment/all-transactions"); 
    return response.data;
};