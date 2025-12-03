require("dotenv").config();
const express = require("express");
const db = require("./models");

const app = express();

// ========== CORS SAFE ==========
const allowedOrigins = [
  "https://www.sibaso.site",
  "https://sibaso.site",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Authorization, x-access-token, Origin, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
// =================================

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// register routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/courseTag.routes")(app);
require("./routes/questionSet.routes")(app);
require("./routes/file.routes")(app);
require("./routes/dosen.routes")(app);
require("./routes/materialTag.routes")(app);
require("./routes/dropdown.routes")(app);
require("./routes/courseMaterial.routes")(app);
require("./routes/questionPackage.routes")(app);

// start server first (supaya CORS on)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

// sync database belakangan (tidak blokir server)
db.sequelize
  .sync()
  .then(() => console.log("✅ Database synced"))
  .catch((err) => console.error("❌ DB sync error:", err));
