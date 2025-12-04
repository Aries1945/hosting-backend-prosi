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

// ✅ CORS Configuration - SIMPLE AND DIRECT
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
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// ✅ CRITICAL: Handle OPTIONS requests FIRST - before CORS middleware
// Ini memastikan preflight requests ditangani dengan benar
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    const path = req.path || req.url;
    console.log(`🚨 OPTIONS Request caught early: ${path} from: ${origin || '(no origin)'}`);
    
    if (origin && allowedOrigins.includes(origin)) {
      console.log(`✅ OPTIONS Allowed early for: ${origin} on path: ${path}`);
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, x-access-token, Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma, Expires");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Max-Age", "86400");
      return res.status(200).end();
    }
    
    // Tetap kirim response untuk debugging
    if (origin) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    return res.status(200).end();
  }
  next();
});

// ✅ Apply CORS middleware - handles both OPTIONS and actual requests
app.use(cors(corsOptions));

// ✅ Explicit OPTIONS handler for all routes (backup)
app.options("*", cors(corsOptions));

// ✅ Explicit OPTIONS handler khusus untuk course-material-stats (triple protection)
app.options("/api/course-material-stats", (req, res) => {
  const origin = req.headers.origin;
  console.log(`🔍 OPTIONS Preflight for /api/course-material-stats from: ${origin || '(no origin)'}`);
  
  if (origin && allowedOrigins.includes(origin)) {
    console.log(`✅ OPTIONS Allowed for: ${origin}`);
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Authorization, x-access-token, Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma, Expires");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(200).end();
  }
  
  // Tetap kirim response meskipun origin tidak diizinkan
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.status(200).end();
});

// ✅ Safety net: Pastikan CORS headers SELALU ada untuk SEMUA response
// OPTIONS sudah dihandle di middleware sebelumnya, jadi skip di sini
app.use((req, res, next) => {
  // Skip OPTIONS - sudah dihandle sebelumnya
  if (req.method === "OPTIONS") {
    return next();
  }
  
  const origin = req.headers.origin;
  
  // Set CORS headers untuk SEMUA response jika origin diizinkan
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
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

// ✅ Error handler - Pastikan CORS headers tetap ada saat error
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  
  // Set CORS headers bahkan saat error
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  
  console.error("❌ Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

// ✅ 404 handler - Pastikan CORS headers tetap ada untuk 404
app.use((req, res) => {
  const origin = req.headers.origin;
  
  // Set CORS headers untuk 404
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  
  res.status(404).json({ message: "Route not found" });
});

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
