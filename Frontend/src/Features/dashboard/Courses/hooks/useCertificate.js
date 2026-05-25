// ======================================================
// 📁 hooks/useCertificate.js
// ======================================================

import { useDispatch, useSelector } from "react-redux";
import {
  createCertificate,
  fetchAllCertificates,
  fetchMyCertificates,
  fetchCertificateById,
  removeCertificate,
  clearCertificateState,
} from "../certificate.slice";

export const useCertificate = () => {
  const dispatch = useDispatch();

  const {
    certificates,
    myCertificates,
    selectedCertificate,
    loading,
    error,
  } = useSelector((state) => state.certificate);

  return {
    certificates,
    myCertificates,
    selectedCertificate,
    loading,
    error,

    createCertificate: (data) => dispatch(createCertificate(data)),
    getAllCertificates: () => dispatch(fetchAllCertificates()),
    getMyCertificates: () => dispatch(fetchMyCertificates()),
    getCertificateById: (id) => dispatch(fetchCertificateById(id)),
    deleteCertificate: (id) => dispatch(removeCertificate(id)),
    clearCertificateState: () => dispatch(clearCertificateState()),
  };
};