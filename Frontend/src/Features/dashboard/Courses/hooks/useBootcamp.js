import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBootcamps,
  fetchAdminBootcamps,
  fetchBootcampById,
  createBootcamp as createBootcampAction,
  updateBootcamp as updateBootcampAction,
  deleteBootcamp as deleteBootcampAction,
} from "../redux/bootcampSlice";

export const useBootcamp = (autoFetch = true) => {
  const dispatch = useDispatch();

  const {
    bootcamps = [],
    bootcamp = null,
    loading = false,
    error = null,
  } = useSelector((state) => state.bootcamp || {});

  const loadBootcamps = useCallback(() => dispatch(fetchBootcamps()), [dispatch]);
  const loadAdminBootcamps = useCallback(() => dispatch(fetchAdminBootcamps()), [dispatch]);
  const loadBootcamp = useCallback((id) => dispatch(fetchBootcampById(id)), [dispatch]);

  const createBootcamp = useCallback(
    async (data) => {
      try {
        const result = await dispatch(createBootcampAction(data)).unwrap();
        return { success: true, data: result };
      } catch (err) {
        return { success: false, message: err?.message || "Failed to create bootcamp" };
      }
    },
    [dispatch]
  );

  const updateBootcamp = useCallback(
    async (id, data) => {
      try {
        const result = await dispatch(updateBootcampAction({ id, payload: data })).unwrap();
        return { success: true, data: result };
      } catch (err) {
        return { success: false, message: err?.message || "Failed to update bootcamp" };
      }
    },
    [dispatch]
  );

  const deleteBootcamp = useCallback(
    async (id) => {
      try {
        const result = await dispatch(deleteBootcampAction(id)).unwrap();
        return { success: true, id: result };
      } catch (err) {
        return { success: false, message: err?.message || "Failed to delete bootcamp" };
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (autoFetch) {
      loadBootcamps();
    }
  }, [autoFetch, loadBootcamps]);

  return {
    bootcamps,
    bootcamp,
    loading,
    error,

    loadBootcamps,
    loadAdminBootcamps,
    loadBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
  };
};