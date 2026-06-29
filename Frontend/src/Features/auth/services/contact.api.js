import API from "../../auth/services/api";

// ======================================================
// 📞 CREATE CALLBACK REQUEST (USER)
// ======================================================
export const createContact = (data) =>
  API.post("/contact/create", data);

// ======================================================
// 📋 GET ALL CONTACT REQUESTS (ADMIN)
// ======================================================
export const getAllContacts = () =>
  API.get("/contact/all");

// ======================================================
// 🗑 DELETE CONTACT REQUEST (ADMIN)
// ======================================================
export const deleteContact = (id) =>
  API.delete(`/contact/${id}`);

// ======================================================
// 🔁 UPDATE CONTACT STATUS (ADMIN) ⭐ NEW
// ======================================================
export const updateContactStatus = (id, status) =>
  API.put(`/contact/status/${id}`, { status });