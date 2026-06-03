import API from "../../../../auth/services/api";

// ================= ADD BOOKMARK =================
export const addBookmarkAPI = async (data) => {
  const res = await API.post(
    "/bookmarks",
    data
  );

  return res.data;
};

// ================= GET BOOKMARKS =================
export const getBookmarksAPI = async () => {
  const res = await API.get(
    "/bookmarks"
  );

  return res.data;
};

// ================= REMOVE BOOKMARK =================
export const removeBookmarkAPI = async (
  lessonId
) => {
  const res = await API.delete(
    `/bookmarks/${lessonId}`
  );

  return res.data;
};