import express from "express";
import { createServer } from "http";
import { Server as SocketIO } from "socket.io";
import cors from "cors";

import { dbConnection } from "./src/dbConnect.js";
import { checkIfElevatorDocumentExist } from "./src/elevatorModel.js";
import { setupRoutes } from "./src/routes.js";
import ElevatorManager from "./src/elevatorManager.js";

const app = express();
const httpServer = createServer(app);

const io = new SocketIO(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(cors());

setupRoutes(app, io);

async function startServer() {
  try {
    await dbConnection;
    await checkIfElevatorDocumentExist();
    const port = process.env.PORT || 5000;
    httpServer.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error);
  }
}

startServer();
