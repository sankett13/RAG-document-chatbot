const express = require("express");
const path = require("path");
const userRouter = require("./routes/user");
const staticRoutes = require("./staticRoutes");
const { connect } = require("./connection");
const { authenticateToken } = require("./middlewares/token_authenticate");
const cookieParser = require("cookie-parser");
// const expressLayouts = require('express-ejs-layouts');
const cors = require("cors");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve("./public")));
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  })
); // Enable CORS if needed
// app.use(expressLayouts);
// app.set('layout', 'layout');

// Connect to the PostgreSQL database
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/user", authenticateToken, userRouter);
app.use("/", staticRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
