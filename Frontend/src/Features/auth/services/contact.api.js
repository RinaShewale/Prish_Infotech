import API from "../../auth/services/api";

// ✅ CREATE CALLBACK REQUEST
export const createContact = (data) =>
  API.post("/contact/create", data);