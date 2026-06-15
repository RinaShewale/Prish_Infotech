import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getNotificationsAPI,
  createNotificationAPI,
  markAsReadAPI,
  deleteNotificationAPI,
} from "../service/notification.api";

// =====================
// GET NOTIFICATIONS
// =====================
export const getNotifications = createAsyncThunk(
  "notification/getAll",
  async (_, thunkAPI) => {
    try {
      const res = await getNotificationsAPI();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// =====================
// CREATE NOTIFICATION
// =====================
export const createNotification = createAsyncThunk(
  "notification/create",
  async (data, thunkAPI) => {
    try {
      const res = await createNotificationAPI(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// =====================
// MARK AS READ
// =====================
export const markAsRead = createAsyncThunk(
  "notification/read",
  async (id, thunkAPI) => {
    try {
      await markAsReadAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// =====================
// DELETE NOTIFICATION
// =====================
export const deleteNotification = createAsyncThunk(
  "notification/delete",
  async (id, thunkAPI) => {
    try {
      await deleteNotificationAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);

// =====================
// SLICE
// =====================
const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      // GET
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.isRead).length;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
        state.unreadCount += 1;
      })

      // MARK AS READ
      .addCase(markAsRead.fulfilled, (state, action) => {
        const notif = state.notifications.find(
          (n) => n._id === action.payload
        );

        if (notif) {
          notif.isRead = true;
          state.unreadCount = state.notifications.filter(
            (n) => !n.isRead
          ).length;
        }
      })

      // DELETE
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (n) => n._id !== action.payload
        );

        state.unreadCount = state.notifications.filter(
          (n) => !n.isRead
        ).length;
      });
  },
});

export default notificationSlice.reducer;