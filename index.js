import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import createErrors from "http-errors";
import postsRoutes from "./api/routes/posts.js";
import userRoutes from "./api/routes/users.routes.js";
import { verifyAccessToken } from "./helpers/jwt.accessTokens.js";
dotenv.config();

const app = express();
app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use("/auth", userRoutes);
app.use("/posts", postsRoutes);
app.get("/", verifyAccessToken, (req, res, next) => {
  res.send("Hey welcome to lify.com ");
});

app.use(async (req, res, next) => {
  //   const error = new Error("Not Found");
  //   error.status = 404;
  //   next(error);
  next(createErrors.NotFound("This route does not exist"));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error,
    status: error.status || 500,
  });
});
const { MONGO_URL, DB_NAME } = process.env;
const PORT = process.env.PORT || 5000;
mongoose
  .connect(MONGO_URL, {
    dbName: DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend running on ${PORT}..... `);
    });
  })
  .catch((error) => {
    console.log(error);
    console.log("Backend failed isn't running.....");
    process.exit(1);
  });

mongoose.connection.on("connection", () => {
  console.log("Mongoose connection to db is very successfully");
});
