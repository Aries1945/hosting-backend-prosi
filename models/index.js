const { Sequelize } = require("sequelize");
const db = {};

// 🔥 Init Sequelize via DATABASE_PUBLIC_URL
const sequelize = new Sequelize(process.env.DATABASE_PUBLIC_URL, {
  dialect: "postgres",
  logging: false,
});

// Register to db object
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.user = require("./user.model.js")(sequelize, Sequelize);
db.courseTag = require("./courseTag.model.js")(sequelize, Sequelize);
db.materialTag = require("./materialTag.model.js")(sequelize, Sequelize);
db.question = require("./question.model.js")(sequelize, Sequelize);
db.questionSet = require("./questionSet.model.js")(sequelize, Sequelize);
db.questionHistory = require("./questionHistory.model.js")(sequelize, Sequelize);
db.file = require("./file.model.js")(sequelize, Sequelize);
db.question_packages = require("./questionPackage.model.js")(sequelize, Sequelize);
db.question_package_items = require("./questionPackageItem.model.js")(sequelize, Sequelize);

// ================= RELATIONSHIPS =================

// User and Question
db.user.hasMany(db.question, { as: "questions", foreignKey: "createdBy" });
db.question.belongsTo(db.user, { as: "creator", foreignKey: "createdBy" });

// Question and CourseTag
db.question.belongsToMany(db.courseTag, {
  through: "question_course_tags",
  foreignKey: "questionId",
  otherKey: "courseTagId",
});
db.courseTag.belongsToMany(db.question, {
  through: "question_course_tags",
  foreignKey: "courseTagId",
  otherKey: "questionId",
});

// Question and MaterialTag
db.question.belongsToMany(db.materialTag, {
  through: "question_material_tags",
  foreignKey: "questionId",
  otherKey: "materialTagId",
});
db.materialTag.belongsToMany(db.question, {
  through: "question_material_tags",
  foreignKey: "materialTagId",
  otherKey: "questionId",
});

// QuestionPackage relations
db.question_packages.belongsTo(db.courseTag, {
  foreignKey: "course_id",
  as: "course",
});
db.question_packages.belongsTo(db.user, {
  foreignKey: "created_by",
  as: "creator",
});
db.question_packages.hasMany(db.question_package_items, {
  foreignKey: "question_package_id",
  as: "items",
});
db.question_package_items.belongsTo(db.questionSet, {
  foreignKey: "question_id",
  as: "question",
});
db.question_package_items.belongsTo(db.question_packages, {
  foreignKey: "question_package_id",
  as: "package",
});
db.questionSet.hasMany(db.question_package_items, {
  foreignKey: "question_id",
  as: "packageItems",
});

// User and QuestionSet
db.user.hasMany(db.questionSet, { as: "questionSets", foreignKey: "createdBy" });
db.questionSet.belongsTo(db.user, { as: "creator", foreignKey: "createdBy" });

// QuestionHistory
db.user.hasMany(db.questionHistory, { foreignKey: "userId" });
db.questionHistory.belongsTo(db.user, { foreignKey: "userId" });
db.questionSet.hasMany(db.questionHistory, { foreignKey: "questionSetId" });
db.questionHistory.belongsTo(db.questionSet, { foreignKey: "questionSetId" });

// File
db.questionSet.hasMany(db.file, { as: "files", foreignKey: "question_set_id" });
db.file.belongsTo(db.questionSet, { foreignKey: "question_set_id" });

module.exports = db;
