import express from "express";
import { Router } from "express";
import ElevatorManager from "./elevatorManager.js";
import {
  isElevatorAvailable,
  getElevatorStatus,
  updateElevatorDB,
} from "./crudOperations.js";

export function setupRoutes(app, io) {
  const router = Router();
  const elevatorManager = new ElevatorManager(io);

  router.use(express.json()); // Middleware to read JSON-data from POST req

  router.post("/callElevator", async (req, res) => {
    const floor = req.body.floor;

    if (typeof floor === "undefined" || floor === null) {
      return res.status(400).json({ message: "Floor parameter missing." });
    }

    try {
      const message = await elevatorManager.handleElevatorCalls(floor);
      console.log("Response being sent:", { message: message });
      res.json({ message: message });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  router.get("/elevator/status", async (req, res) => {
    try {
      const elevatorStatus = await getElevatorStatus();
      res.status(200).json(elevatorStatus);
    } catch (error) {
      console.error("Failed to fetch elevator status:", error);
      res.status(500).json({
        message: "Failed to fetch elevator status. Please try again later.",
      });
    }
  });

  router.put("/updateElevatorStatus", async (req, res) => {
    const { id, status } = req.body;
    try {
      await updateElevatorDB(id, status);
      res.status(200).json({
        message: `Elevator status updated successfully for elevator ${id}.`,
      });
    } catch (error) {
      console.error("Failed to update elevator status:", error);
      res.status(500).json({
        message: "Failed to update elevator status. Please try again later.",
      });
    }
  });

  //Check if specific elevator is available
  router.get("/elevator/available/:elevatorId", async (req, res) => {
    try {
      const elevatorId = req.params.elevatorId;

      if (isNaN(elevatorId)) {
        res.status(400).json({ message: "Invalid elevatorId." });
        return;
      }

      const isAvailable = await isElevatorAvailable(elevatorId);

      if (isAvailable) {
        res.send(`Elevator with ID ${elevatorId} is available.`);
      } else {
        res.send(`Elevator with ID ${elevatorId} is not available.`);
      }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error:" });
    }
  });
  app.use(router);
}

export { Router, ElevatorManager };
