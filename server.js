require('dotenv').config();
const express = require("express");
const cors = require("cors");
const db = require("./models"); // Sequelize setup

const app = express();

// ✅ Daftar domain Frontend yang diizinkan (bisa ditambah)
const allowedOrigins = [
  "https://www.sibaso.site",
  "https://sibaso.site"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Log for debugging
    console.log(`🔍 CORS check - Origin: ${origin || 'no origin'}`);
    
    // Allow requests with no origin (like mobile apps, Postman, or same-origin requests)
    if (!origin) {
      console.log("✅ Allowing request with no origin");
      return callback(null, true);
    }
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS allowed for origin: ${origin}`);
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      console.warn(`   Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error("Not allowed by CORS"));
    }
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
    "Expires",
    "X-Requested-With"
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// ✅ Handle OPTIONS requests FIRST (before CORS middleware)
// This ensures preflight requests are handled correctly
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  console.log(`🔍 OPTIONS preflight request from origin: ${origin}`);
  
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Authorization, x-access-token, Origin, Content-Type, Accept, Cache-Control, Pragma, Expires, X-Requested-With");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "86400");
    console.log(`✅ OPTIONS preflight allowed for: ${origin}`);
    return res.status(204).send();
  }
  
  console.warn(`⚠️ OPTIONS preflight blocked for: ${origin}`);
  res.status(403).json({ error: "Not allowed by CORS" });
});

// ✅ Pasang middleware CORS - handles actual requests
// This handles both preflight (OPTIONS) and actual requests
app.use(cors(corsOptions));

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
