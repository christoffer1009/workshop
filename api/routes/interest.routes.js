const interestController = require("../controllers/interest.controller");
const { authJwt } = require("../middleware");
const router = require("express").Router();

router.post(
  "/",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  interestController.createInterest
);

router.delete(
  "/:id",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  interestController.deleteInterest
);

router.get(
  "/",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  interestController.getInterests
);

module.exports = router;
