import { useDispatch } from "react-redux";

import {
  createContact,
  getAllContacts,
  deleteContact,
  updateContactStatus,
} from "../services/contact.api";

import {
  setLoading,
  setError,
  setSuccess,
  setContacts,
  removeContact,
  updateContactStatusState,
} from "../redux/contact.slice";

export const useContact = () => {
  const dispatch = useDispatch();

  // ======================================================
  // 📞 CREATE CONTACT (USER)
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

  // ======================================================
  // 📋 GET ALL CONTACTS (ADMIN)
  // ======================================================
  const fetchContacts = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const res = await getAllContacts();

      dispatch(setContacts(res.data.contacts));

      return {
        success: true,
        data: res.data.contacts,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to fetch contacts";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ======================================================
  // 🗑 DELETE CONTACT (ADMIN)
  // ======================================================
  const handleDeleteContact = async (id) => {
    try {
      dispatch(setLoading(true));

      await deleteContact(id);

      dispatch(removeContact(id));

      return {
        success: true,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to delete contact";

      dispatch(setError(message));

      return {
        success: false,
        message,
      };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ======================================================
  // 🔁 UPDATE STATUS (ADMIN) ⭐ NEW
  // ======================================================
  const handleUpdateStatus = async (id, status) => {
    try {
      dispatch(setLoading(true));

      const res = await updateContactStatus(id, status);

      // update redux state instantly
      dispatch(
        updateContactStatusState({ id, status })
      );

      return {
        success: true,
        data: res.data,
      };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to update status";

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
    fetchContacts,
    handleDeleteContact,
    handleUpdateStatus, // ⭐ NEW EXPORT
  };
};