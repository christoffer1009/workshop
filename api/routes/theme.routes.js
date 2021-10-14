const controller = require("../controllers/theme.controller");
const router = require("express").Router();
const { authJwt } = require("../middleware");

// Create a new Tutorial
router.post(
  "/",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  controller.create
);

// Retrieve all Tutorials
router.get("/", controller.findAll);

// Retrieve a single Tutorial with id
router.get("/:id", controller.findOne);

// Update a Tutorial with id
router.patch(
  "/:id",
  authJwt.verifyToken,
  authJwt.isStudentOrInstructor,
  controller.update
);

// app.use(bodyParser.json());
// app.use("/themes", router);

module.exports = router;
