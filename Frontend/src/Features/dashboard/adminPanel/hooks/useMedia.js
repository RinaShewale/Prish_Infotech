import { useDispatch, useSelector } from "react-redux";
import { setMedia, setMediaError, setMediaLoading } from "../redux/mediaSlice";
import { getMedia, createMedia, uploadMediaImage, uploadMediaVideo } from "../services/media.api";

export const useMedia = () => {
  const dispatch = useDispatch();
  const mediaState = useSelector((state) => state.media);

  const fetchMedia = async () => {
    try {
      dispatch(setMediaLoading(true));
      const { data } = await getMedia();
      dispatch(setMedia(data.media));
    } catch (err) {
      dispatch(setMediaError(err.response?.data?.message || err.message));
    } finally {
      dispatch(setMediaLoading(false));
    }
  };

  const saveMedia = async (payload) => {
    try {
      dispatch(setMediaLoading(true));
      const { data } = await createMedia(payload);
      dispatch(setMedia(data.media));
      return data;
    } catch (err) {
      dispatch(setMediaError(err.response?.data?.message || err.message));
      throw err;
    } finally {
      dispatch(setMediaLoading(false));
    }
  };

  // Helper for Uploading Images
  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const { data } = await uploadMediaImage(formData);
    return data; // returns { success: true, url: "..." }
  };

  // Helper for Uploading Videos
  const handleUploadVideo = async (file) => {
    const formData = new FormData();
    formData.append("video", file);
    const { data } = await uploadMediaVideo(formData);
    return data; // returns { success: true, url: "..." }
  };

  return {
    ...mediaState,
    fetchMedia,
    saveMedia,
    handleUploadImage,
    handleUploadVideo,
  };
};