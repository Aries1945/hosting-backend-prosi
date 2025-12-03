const express = require("express");
const cors = require("cors");
const db = require("./models"); // Import your Sequelize setup

const app = express();

// ✅ Daftar domain Frontend yang diizinkan (bisa ditambah)
const allowedOrigins = [
  "https://www.sibaso.site",
  "https://sibaso.site"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH","DELETE", "OPTIONS"],
  allowedHeaders: ["Authorization", "x-access-token", "Origin", "Content-Type", "Accept","Cache-Control","Pragma","Expires"],
  credentials: true
};

// ✅ Pasang middleware CORS
app.use(cors(corsOptions));

// ✅ Parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
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

// Use routes
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

// Database connection and server start (FIXED - only once!)
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synchronized successfully");
    
    // Start server ONLY after DB sync is successful
    const PORT = process.env.PORT || 8080; 
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
 
    });
  })
  .catch(err => {
    console.error("❌ Failed to sync database:", err);
    process.exit(1); // Exit if database sync fails
  });