require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./models"); // Sequelize setup

const app = express();

// ✅ Daftar domain Frontend yang diizinkan
const allowedOrigins = [
  "https://www.sibaso.site",
  "https://sibaso.site"
];

// ✅ CORS Configuration - Simple and Robust
const corsOptions = {
  origin: function (origin, callback) {
    // Log untuk debugging
    console.log(`🔍 CORS Origin Check: ${origin || '(no origin)'}`);
    
    // Allow requests dengan no origin (Postman, mobile apps, dll)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check jika origin ada di allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS Allowed: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`❌ CORS Blocked: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Authorization",
    "x-access-token",
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Cache-Control",
    "Pragma",
    "Expires"
  ],
  credentials: true,
  optionsSuccessStatus: 200 // Some browsers expect 200 instead of 204
};

// ✅ Apply CORS middleware FIRST - before everything else
app.use(cors(corsOptions));

// ✅ Explicit OPTIONS handler untuk semua routes (preflight)
app.options("*", cors(corsOptions));

// ✅ Safety net: Global middleware untuk memastikan CORS headers selalu ada
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Jika origin ada di allowed list, set CORS headers
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }
  
  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    if (origin && allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Authorization, x-access-token, Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma, Expires");
      res.header("Access-Control-Max-Age", "86400");
      return res.status(200).end();
    }
  }
  
  next();
});

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
    });
  })
  .catch(err => {
    console.error("❌ Failed to sync database:", err);
  });
