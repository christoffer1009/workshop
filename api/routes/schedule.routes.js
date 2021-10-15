const scheduleController = require("../controllers/schedule.controller");
const { authJwt } = require("../middleware");
const router = require("express").Router();

router.post(
  "/",
  authJwt.verifyToken,
  authJwt.isInstructor,
  scheduleController.createSchedule
);
router.get(
  "/",
  authJwt.verifyToken,
  authJwt.isInstructor,
  scheduleController.getSchedulesByinstructor
);
router.patch(
  "/:id",
  authJwt.verifyToken,
  authJwt.isInstructor,
  scheduleController.updateSchedule
);
router.delete(
  "/:id/themes/:themeId",
  authJwt.verifyToken,
  authJwt.isInstructor,
  scheduleController.deleteScheduleTheme
);
router.post(
  "/:id/themes",
  authJwt.verifyToken,
  authJwt.isInstructor,
  scheduleController.addScheduleTheme
);

module.exports = router;
