const express = require("express");
const cors = require("cors");
const db = require("./api/models");
const userRouter = require("./api/routes/user.routes");
const authRouter = require("./api/routes/auth.routes");

const app = express();

var corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Type = db.type;
const User = db.user;

db.sequelize.sync();

// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and Resync Db");
//   initial();
// });

// function initial() {
//   User.create({
//     id: 1,
//     name: "Nome1",
//     email: "nome1@email.com",
//     password: "123456",
//     type: "student",
//   });

//   User.create({
//     name: "Nome2",
//     email: "nome2@email.com",
//     password: "123456",
//     type: "student",
//   });

//   User.create({
//     name: "Nome3",
//     email: "nome3@email.com",
//     password: "123456",
//     type: "instructor",
//   });
// }

// routes
// require("./api/routes/auth.routes")(app);
// require("./api/routes/user.routes")(app);
app.use("/api/workshop/users", userRouter);
app.use("/api/workshop/auth", authRouter);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to workshop application." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
