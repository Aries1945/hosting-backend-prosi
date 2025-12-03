require("dotenv").config();
const express = require("express");
const db = require("./models"); // Sequelize setup

const app = express();

// ===================== 🔐 CORS SAFE PRODUCTION =====================
const allowedOrigins = [
  "https://www.sibaso.site",
  "https://sibaso.site",
  // "http://localhost:3000" // aktifkan kalau mau testing lokal
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Authorization, x-access-token, Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");

  // Preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
// ===================================================================

// Parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import semua routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const courseTagRoutes = require("./routes/courseTag.routes");
const questionSetRoutes = require("./routes/questionSet.routes");
const fileRoutes = require("./routes/file.routes");
const dosenRoutes = require("./routes/dosen.routes");
const materialRoutes = require("./routes/materialTag.routes");
const dropdownRoutes = require("./routes/dropdown.routes");
const courseMaterialRoutes = require("./routes/courseMaterial.routes");
const questionPackageRoutes = require("./routes/questionPackage.routes");

// Register ke Express
courseMaterialRoutes(app);
authRoutes(app);
userRoutes(app);
courseTagRoutes(app);
questionSetRoutes(app);
fileRoutes(app);
dosenRoutes(app);
materialRoutes(app);
dropdownRoutes(app);
questionPackageRoutes(app);

// Port Railway atau default 8080
const PORT = process.env.PORT || 8080;

// Sync database dan start server
db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to sync database:", err);
  });
