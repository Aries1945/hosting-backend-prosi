const { authJwt } = require("../middlewares");
const controller = require("../controllers/materialTag.controller");

module.exports = function(app) {
  // CORS sudah dihandle global di server.js, tidak perlu middleware tambahan

  // Routes untuk manajemen tag (admin only)
  app.post(
    "/api/material-tags",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createMaterialTag
  );

  app.get(
    "/api/material-tags",
    [authJwt.verifyToken],
    controller.getAllMaterialTag
  );

  app.put(
    "/api/material-tags/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateMaterialTag
  );

  app.delete(
    "/api/material-tags/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteMaterialTag
  );
};