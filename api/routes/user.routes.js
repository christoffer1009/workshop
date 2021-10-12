const { validateSignUp, authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const router = require("express").Router();

// module.exports = function (app) {
//   app.use(function (req, res, next) {
//     res.header(
//       "Access-Control-Allow-Headers",
//       "token, Origin, Content-Type, Accept"
//     );
//     next();
//   });

// app.get("/test/all", controller.allAccess);

// app.get(
//   "/test/student",
//   authJwt.verifyToken,
//   authJwt.isStudent,
//   controller.studentContent
// );

// app.get(
//   "/test/instructor",
//   authJwt.verifyToken,
//   authJwt.isInstructor,
//   controller.instructorContent
// );

// app.get(
//   "/test/student_or_instructor",
//   authJwt.verifyToken,
//   authJwt.isStudentOrInstructor,
//   controller.studentOrInstructorContent
// );

// app.post(
//   "/api/auth/signup",
//   [verifySignUp.checkEmailExists, verifySignUp.checkType],
//   controller.signUp
// );
// };

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
  controller.updateUser
);

module.exports = router;
