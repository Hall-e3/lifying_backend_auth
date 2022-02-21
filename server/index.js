import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import createErrors from "http-errors";
import postRoutes from "./routes/posts.routes.js";
import userRoutes from "./routes/users.routes.js";
import { verifyAccessToken } from "./helpers/jwt.accessTokens.js";
dotenv.config();

const app = express();
app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());
app.use("/auth", userRoutes);
app.use("/posts", postRoutes);
app.get("/", verifyAccessToken, (req, res, next) => {
  res.send("Hey welcome to lify.com ");
});
app.use(morgan("dev"));
// const corsOptions ={
//   origin:'http://localhost:3000',
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }

app.use(async (req, res, next) => {
  next(createErrors.NotFound("This route does not exist"));
});

app.use((err, req, res, next) => {
  res.status = err.status || 500;
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const { MONGO_DB_URL, PORT, DB_NAME } = process.env;
mongoose
  .connect(MONGO_DB_URL, {
    dbName: DB_NAME,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running successfully on ${PORT} .....`);
    });
  })
  .catch((error) => {
    console.log("Server failed to run successfully");
    console.log(error.message);
    process.exit(1);
  });
mongoose.connection.on("connection", () => {
  console.log("Mongoose connection to db is successfull");
});
