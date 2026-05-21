import { useDispatch } from "react-redux";

import { createContact } from "../services/contact.api";

import {
  setLoading,
  setError,
  setSuccess,
} from "../contact.slice";

export const useContact = () => {
  const dispatch = useDispatch();

  // ======================================================
  // ✅ CREATE CONTACT
  // ======================================================

  const handleCreateContact = async (formData) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      dispatch(setSuccess(false));

      const res = await createContact(formData);

      dispatch(setSuccess(true));

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to submit request";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    handleCreateContact,
  };
};