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

  // ========================================
  // PASSWORD RESET ROUTES (NEW)
  // ========================================
  
  // Request password reset (send email with reset link)
  app.post('/api/auth/forgot-password', async (req, res) => {
    controller.forgotPassword
});

  // Validate reset token
  app.post(
    "/api/auth/validate-reset-token",
    controller.validateResetToken
  );

  // Reset password with token
  app.post("/api/auth/reset-password",
    controller.resetPassword
  );
};