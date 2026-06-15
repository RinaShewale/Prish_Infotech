import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBootcamps,
  fetchBootcampById,
  createBootcamp,
} from "../redux/bootcampSlice";

export const useBootcamp = (autoFetch = true) => {
  const dispatch = useDispatch();

  const {
    bootcamps = [],
    bootcamp = null,
    loading = false,
    error = null,
  } = useSelector((state) => state.bootcamp || {});

  // ======================
  // ACTIONS
  // ======================
  const loadBootcamps = () => dispatch(fetchBootcamps());
  const loadBootcamp = (id) => dispatch(fetchBootcampById(id));
  const addBootcamp = (data) => dispatch(createBootcamp(data));

  // ======================
  // AUTO FETCH (SAFE)
  // ======================
  useEffect(() => {
    if (autoFetch) {
      loadBootcamps();
    }
  }, [autoFetch, dispatch]);

  return {
    bootcamps,
    bootcamp,
    loading,
    error,

    loadBootcamps,
    loadBootcamp,
    addBootcamp,
  };
};