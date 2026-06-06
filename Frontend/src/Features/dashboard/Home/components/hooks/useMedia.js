import { useEffect, useState } from "react";
import { getMediaAPI } from "../services/media.api";

export const useMedia = () => {
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);

        const res = await getMediaAPI();

        console.log("API RESPONSE:", res.data);

        // ✅ FIX HERE
        setMedia(res.data.media);

        setError(null);
      } catch (err) {
        console.log("Media fetch error:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  return { media, loading, error };
};