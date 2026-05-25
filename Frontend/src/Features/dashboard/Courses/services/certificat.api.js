// ======================================================
// 📁 services/certificateApi.js
// ======================================================

import API from "../../../auth/services/api";

// 🎓 CREATE CERTIFICATE
export const createCertificateApi = async (data) => {
  const res = await API.post("/certificate/create", data);
  return res.data;
};

// 📥 GET ALL CERTIFICATES
export const getAllCertificatesApi = async () => {
  const res = await API.get("/certificate/all");
  return res.data;
};

// 👤 MY CERTIFICATES
export const getMyCertificatesApi = async () => {
  const res = await API.get("/certificate/me");
  return res.data;
};

// 🔍 SINGLE CERTIFICATE
export const getCertificateByIdApi = async (id) => {
  const res = await API.get(`/certificate/${id}`);
  return res.data;
};

// 🗑️ DELETE CERTIFICATE
export const deleteCertificateApi = async (id) => {
  const res = await API.delete(`/certificate/${id}`);
  return res.data;
};