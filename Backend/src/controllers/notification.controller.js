import Notification from "../models/Notification.model.js";

// GET all notifications for user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE notification (admin/system use)
export const createNotification = async (req, res) => {
  try {
    const { user, title, message, type } = req.body;

    const notification = await Notification.create({
      user,
      title,
      message,
      type,
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true,
    });

    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE notification
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndDelete(id);

    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};