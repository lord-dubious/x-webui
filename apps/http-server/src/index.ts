import express from "express";
import next from "next";
import userRouter from "./routes/auth";
import cors from "cors"
import { PORT } from "./config";
import cookieParser from "cookie-parser"
import session from "express-session";
import { SESSION_SECRET } from "./config";
import passport from "./configuration/passportConfig"; 
import twitterRouter from "./routes/twitter";
import contentRouter from "./routes/content";
import postRouter from "./routes/posts";
import mediaRouter from "./routes/media";
import aiRouter from "./routes/ai";
import "./utils/scheduler"

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev, dir: '../web' });
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({ origin: true, credentials: true }));

  app.use(session({
      secret:SESSION_SECRET as string,
      resave:false,
      saveUninitialized:true,
  }))

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/user/path",twitterRouter );
  app.use("/api/v1/user/content",contentRouter );
  app.use("/api/v1/user/posts",postRouter );
  app.use("/api/v1/user/media",mediaRouter );
  app.use("/api/v1/user/ai",aiRouter );

  app.all('*', (req, res) => nextHandler(req, res));

  app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
  });
});