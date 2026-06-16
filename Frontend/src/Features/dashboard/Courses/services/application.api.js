import API, { PUBLIC_API } from "../../../auth/services/api";

// ============================
// CREATE APPLICATION
// ============================

export const createApplicationAPI = async (
  applicationData
) => {
  const res = await PUBLIC_API.post(
    "/applications",
    applicationData
  );

  return res.data;
};

// ============================
// ADMIN GET ALL APPLICATIONS
// ============================

export const getAllApplicationsAPI =
  async () => {
    const res = await API.get(
      "/applications"
    );

    return res.data;
  };

// ============================
// UPDATE STATUS
// ============================

export const updateApplicationStatusAPI =
  async (id, status) => {
    const res = await API.patch(
      `/applications/${id}/status`,
      { status }
    );

    return res.data;
  };