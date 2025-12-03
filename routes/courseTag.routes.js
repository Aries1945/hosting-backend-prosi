const { authJwt } = require("../middlewares");
const controller = require("../controllers/courseTag.controller");

module.exports = function(app) {
  // CORS sudah dihandle global di server.js, tidak perlu middleware tambahan

  // Routes untuk manajemen tag mata kuliah (admin only)
  app.post(
    "/api/course-tags",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.createCourseTag
  );

  app.get(
    "/api/course-tags",
    [authJwt.verifyToken],
    controller.getAllCourseTags
  );

  app.put(
    "/api/course-tags/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateCourseTag
  );

  app.delete(
    "/api/course-tags/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteCourseTag
  );
};