const { validateSignUp, validateUpdate, authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const router = require("express").Router();

router.get("/test/all", controller.allAccess);

router.get(
  "/test/student",
  authJwt.verifyToken,
  authJwt.isStudent,
  controller.studentContent
);

router.get(
  "/test/instructor",
  authJwt.verifyToken,
  authJwt.isInstructor,
  controller.instructorContent
);

router.get(
  "/test/student_or_instructor",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  controller.studentOrInstructorContent
);

router.get(
  "/:id",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  controller.getUserById
);

router.post("/", validateSignUp, controller.signUp);

router.patch(
  "/:id",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  validateUpdate,
  controller.updateUser
);

module.exports = router;
