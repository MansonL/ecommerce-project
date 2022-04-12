import { Server } from "http";
import * as socket from "socket.io";
import { ApiError } from "../api/errorApi";
import { usersApi } from "../api/users";
import { logger } from "./logger";

export const socketConnection = (server: Server) => {
  const io = new socket.Server();
  io.attach(server);
  io.on("connection", (socket) => {
    logger.info("New client connected!");
    socket.on('attach user to id', async (username: string) => {
      const user = await usersApi.getUserByUsername(username);
      if(user instanceof ApiError){""}
      else{
        user.connectionID
      }
    })
  });
};
