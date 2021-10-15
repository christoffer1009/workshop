const express = require("express");
const cors = require("cors");
const db = require("./api/models");
const userRouter = require("./api/routes/user.routes");
const authRouter = require("./api/routes/auth.routes");
const themeRouter = require("./api/routes/theme.routes");
const scheduleRouter = require("./api/routes/schedule.routes");
const interestRouter = require("./api/routes/interest.routes");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db.sequelize.sync();

app.use("/api/workshop/users", userRouter);
app.use("/api/workshop/auth", authRouter);
app.use("/api/workshop/themes", themeRouter);
app.use("/api/workshop/schedules", scheduleRouter);
app.use("/api/workshop/interests", interestRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to workshop application." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
