import "dotenv/config";

import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// ======================
// DATABASE CONNECTION
// ======================
connectDB();

// ======================
// PORT CONFIG
// ======================
const PORT = process.env.PORT || 3000;

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});