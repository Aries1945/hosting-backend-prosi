const { verifySignup } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  // CORS is already handled globally in server.js, no need for duplicate middleware here

  // ========================================
  // EXISTING ROUTES
  // ========================================
  
  app.post(
    "/api/auth/signin",
    controller.signin
  );

  // Debug endpoint to check database status
  app.get("/api/auth/debug/check-database", controller.checkDatabase);
};