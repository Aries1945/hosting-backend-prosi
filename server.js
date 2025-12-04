require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();

// ✅ Daftar domain Frontend yang diizinkan
const allowedOrigins = [
  "https://www.sibaso.site",
  "https://sibaso.site"
];

// ✅ CORS Configuration - SIMPLIFIED AND WORKING
const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🔍 CORS Check: ${origin || '(no origin)'}`);
    
    // Allow requests dengan no origin (Postman, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check jika origin ada di allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS Allowed: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`❌ CORS Blocked: ${origin}`);
      callback(null, false); // Don't throw error, just deny
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
  optionsSuccessStatus: 204, // ⚠️ CRITICAL: Must be 204, not 200!
  preflightContinue: false,
  maxAge: 86400 // Cache preflight for 24 hours
};

// ✅ CRITICAL FIX: Single early OPTIONS handler with correct status code
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    const origin = req.headers.origin;
    console.log(`🚨 OPTIONS Request: ${req.path} from ${origin || '(no origin)'}`);
    
    if (!origin || allowedOrigins.includes(origin)) {
      console.log(`✅ OPTIONS Approved for: ${origin || '(no origin)'}`);
      
      // Set all required CORS headers
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Authorization, x-access-token, Origin, X-Requested-With, Content-Type, Accept, Cache-Control, Pragma, Expires");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Max-Age", "86400");
      
      // ⚠️ CRITICAL: Return 204 No Content (not 200!)
      return res.status(204).end();
    }
    
    // If origin not allowed, still respond but without credentials
    console.warn(`⚠️ OPTIONS Denied for: ${origin}`);
    return res.status(204).end();
  }
  next();
});

// ✅ Apply CORS middleware for actual requests
app.use(cors(corsOptions));

// ✅ Parsing request body (AFTER CORS)
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

// ✅ Register routes
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

// ✅ Error handler with CORS
app.use((err, req, res, next) => {
  const origin = req.headers.origin;
  
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

// ✅ 404 handler with CORS
app.use((req, res) => {
  const origin = req.headers.origin;
  
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  
  console.log(`❌ 404: ${req.method} ${req.path}`);
  res.status(404).json({ message: "Route not found" });
});

// ✅ Port Railway atau default ke 8080
const PORT = process.env.PORT || 8080;

// ✅ Sync database + start server
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synchronized");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  })
  .catch(err => {
    console.error("❌ Failed to sync database:", err);
  });