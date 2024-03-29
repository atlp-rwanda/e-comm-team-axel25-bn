import express, { Response, Request, Application } from "express";
import cors from "cors";
import routes from "./routes";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import http from "http";
import { Server } from "socket.io";

import { MessageResponse } from "./interfaces";
import { sequelize } from "./database/models";
import { DataTypes } from "sequelize";
import { setup } from "./controllers";

declare module "express-session" {
  export interface SessionData {
    userId: string;
  }
}

dotenv.config();

const PORT = process.env.PORT;

const app: Application = express();

export const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://inspiring-choux-2672b4.netlify.app",
      process.env.CLIENT_URL as string,
    ],
    methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
  },
});
const SequelizeSessionStore = SequelizeStore(session.Store);

sequelize.define(
  "Sessions",
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    expires: {
      type: DataTypes.DATE,
    },
    data: {
      type: DataTypes.TEXT,
    },
  },
  { tableName: "sessions" },
);

const sessionStore = new SequelizeSessionStore({
  db: sequelize,
  table: "Sessions",
});

app.use(cors());

setup();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET as string,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: true, // Set to true if using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  }),
);

sessionStore.sync();

app.use(passport.initialize());
app.use(passport.session());
// eslint-disable-next-line @typescript-eslint/ban-types
app.get<{}, MessageResponse>("/", async (req: Request, res: Response) => {
  res.status(200).send({
    status: 200,
    success: true,
    message: `Welcome to team Cypher's API! Endpoints available at http://localhost:${PORT}/api/v1 + whatever endpoint you want to hit`,
  });
});

app.use("/api/v1", routes);

export default app;
