const { authJwt, verifySignup } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  // CORS sudah dihandle global di server.js, tidak perlu middleware tambahan

  // Routes for user management (admin only)
  app.post(
    "/api/users",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignup.checkDuplicateEmail,
      verifySignup.checkRolesExisted
    ],
    controller.createUser
  );

  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.getAllUsers
  );

  app.put(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateUser
  );

  app.delete(
    "/api/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );

  // Protected route example - can be accessed by any authenticated user
  app.get(
    "/api/test/user",
    [authJwt.verifyToken],
    (req, res) => {
      res.status(200).send("User Content.");
    }
  );

  // Protected route example - can only be accessed by admins
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    (req, res) => {
      res.status(200).send("Admin Content.");
    }
  );
};