const { verifySignup } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const { authJwt } = require("../middlewares");

module.exports = function(app) {
  // Middleware CORS untuk mengizinkan frontend Vercel
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://www.sibaso.site"); // frontend domain
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });

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