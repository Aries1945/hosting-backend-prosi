const express = require("express");
const cors = require("cors");
const db = require("./models"); // Sequelize setup

const app = express();

// ✅ Daftar domain Frontend yang diizinkan
const allowedOrigins = [
  "https://www.sibaso.site",
  "https://sibaso.site"
];

const corsOptions = {
  origin: function (origin, callback) {
    // ✅ Allow requests with no origin (mobile apps, Postman, Railway health checks)
    if (!origin) {
      return callback(null, true);
    }
    
    // ✅ Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // ❌ Reject other origins
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Authorization", 
    "x-access-token", 
    "Origin", 
    "Content-Type", 
    "Accept",
    "Cache-Control",
    "Pragma",
    "Expires"
  ],
  credentials: true,
  optionsSuccessStatus: 204 // ✅ Some legacy browsers choke on 200
};

// ✅ Apply CORS middleware globally
app.use(cors(corsOptions));

// ✅ Handle ALL preflight requests explicitly
app.options('*', cors(corsOptions));

// ✅ Parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Import semua routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const courseTagRoutes = require('./routes/courseTag.routes');
const questionSetRoutes = require('./routes/questionSet.routes');
const fileRoutes = require('./routes/file.routes');
const dosenRoutes = require('./routes/dosen.routes');
const materialRoutes = require('./routes/materialTag.routes');
const dropdownRoutes = require('./routes/dropdown.routes');
const courseMaterialRoutes = require('./routes/courseMaterial.routes');
const questionPackageRoutes = require('./routes/questionPackage.routes');

// ✅ Register route ke Express
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

// ✅ Port Railway atau default ke 8080
const PORT = process.env.PORT || 8080;

// ✅ Sync database SEKALI + start server SEKALI
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synchronized");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to sync database:", err);
  });