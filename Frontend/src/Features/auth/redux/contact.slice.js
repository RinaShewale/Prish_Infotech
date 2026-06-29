import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contacts: [],   // 📋 admin list
  loading: false,
  error: null,
  success: false,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,

  reducers: {
    // ======================================================
    // 📦 SET CONTACT LIST
    // ======================================================
    setContacts: (state, action) => {
      state.contacts = action.payload;
    },

    // ======================================================
    // ❌ REMOVE CONTACT
    // ======================================================
    removeContact: (state, action) => {
      state.contacts = state.contacts.filter(
        (c) => c._id !== action.payload
      );
    },

    // ======================================================
    // 🔁 UPDATE STATUS IN STORE ⭐ NEW
    // ======================================================
    updateContactStatusState: (state, action) => {
      const { id, status } = action.payload;

      state.contacts = state.contacts.map((c) =>
        c._id === id ? { ...c, status } : c
      );
    },

    // ======================================================
    // ⚙️ UI STATES
    // ======================================================
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    setSuccess: (state, action) => {
      state.success = action.payload;
    },

    resetSuccess: (state) => {
      state.success = false;
    },
  },
});

export const {
  setContacts,
  removeContact,
  updateContactStatusState,
  setLoading,
  setError,
  setSuccess,
  resetSuccess,
} = contactSlice.actions;

export default contactSlice.reducer;