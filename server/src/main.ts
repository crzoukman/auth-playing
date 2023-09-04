import express, { json } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./router";

const server = express();

server.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
server.use(json());
server.use(cookieParser());
server.use(router);

server.listen(3000, () => {
  console.log("Server is running");
});
