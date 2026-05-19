import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

export const createAdminIfNotExists = async () => {
  try {
    const adminEmail = "prishinfotech@gmail.com";

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("👑 Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Prish Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("👑 Admin created successfully");
  } catch (error) {
    console.log("Admin seed error:", error.message);
  }
};