import { useDispatch } from "react-redux";

import {
  setLoading,
  setApplications,
  setError,
} from "../redux/application.slice";

import {
  createApplicationAPI,
  getAllApplicationsAPI,
  updateApplicationStatusAPI,
} from "../services/application.api";

export const useApplication =
  () => {
    const dispatch =
      useDispatch();

    // ==========================
    // CREATE APPLICATION
    // ==========================

    const handleCreateApplication =
      async (formData) => {
        try {
          dispatch(
            setLoading(true)
          );

          const data =
            await createApplicationAPI(
              formData
            );

          return data;
        } catch (error) {
          dispatch(
            setError(
              error.response?.data
                ?.message
            )
          );

          throw error;
        } finally {
          dispatch(
            setLoading(false)
          );
        }
      };

    // ==========================
    // GET ALL APPLICATIONS
    // ==========================

    const handleGetApplications =
      async () => {
        try {
          dispatch(
            setLoading(true)
          );

          const data =
            await getAllApplicationsAPI();

          dispatch(
            setApplications(
              data.data
            )
          );

          return data;
        } catch (error) {
          dispatch(
            setError(
              error.response?.data
                ?.message
            )
          );
        } finally {
          dispatch(
            setLoading(false)
          );
        }
      };

    // ==========================
    // UPDATE STATUS
    // ==========================

    const handleUpdateStatus =
      async (id, status) => {
        try {
          dispatch(
            setLoading(true)
          );

          const data =
            await updateApplicationStatusAPI(
              id,
              status
            );

          await handleGetApplications();

          return data;
        } catch (error) {
          dispatch(
            setError(
              error.response?.data
                ?.message
            )
          );
        } finally {
          dispatch(
            setLoading(false)
          );
        }
      };

    return {
      handleCreateApplication,
      handleGetApplications,
      handleUpdateStatus,
    };
  };