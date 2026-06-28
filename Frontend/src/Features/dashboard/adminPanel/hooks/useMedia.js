import { useDispatch, useSelector } from "react-redux";

import {
  setMedia,
  setMediaError,
  setMediaLoading,
} from "../redux/mediaSlice";

import {
  getMedia,
  createMedia,
} from "../services/media.api";

export const useMedia = () => {
  const dispatch = useDispatch();

  const mediaState = useSelector(
    (state) => state.media
  );

  // GET MEDIA
  const fetchMedia = async () => {
    try {
      dispatch(setMediaLoading(true));

      const { data } = await getMedia();

      dispatch(setMedia(data.media));
    } catch (err) {
      dispatch(
        setMediaError(
          err.response?.data?.message ||
            err.message
        )
      );
    } finally {
      dispatch(setMediaLoading(false));
    }
  };

  // CREATE / UPDATE MEDIA
  const saveMedia = async (payload) => {
    try {
      dispatch(setMediaLoading(true));

      const { data } =
        await createMedia(payload);

      dispatch(setMedia(data.media));

      return data;
    } catch (err) {
      dispatch(
        setMediaError(
          err.response?.data?.message ||
            err.message
        )
      );

      throw err;
    } finally {
      dispatch(setMediaLoading(false));
    }
  };

  return {
    ...mediaState,
    fetchMedia,
    saveMedia,
  };
};