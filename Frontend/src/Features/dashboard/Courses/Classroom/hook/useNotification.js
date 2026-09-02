import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification,
} from "../redux/notification.slice";

export const useNotification = () => {
  const dispatch = useDispatch();

  const { notifications, loading, error, unreadCount } = useSelector(
    (state) => state.notification
  );

  return {
    notifications,
    loading,
    error,
    unreadCount,

    fetchNotifications: useCallback(
      () => dispatch(getNotifications()),
      [dispatch]
    ),
    addNotification: (data) => dispatch(createNotification(data)),
    readNotification: (id) => dispatch(markAsRead(id)),
    removeNotification: (id) => dispatch(deleteNotification(id)),
  };
};