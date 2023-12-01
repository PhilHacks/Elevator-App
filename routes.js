import express from "express";
import { Router } from "express";
import { dbConnection } from "./databaseConnect.js";
import ElevatorManager from "./elevatorManager.js";
import {
  isElevatorAvailableInDb,
  getElevatorStatusInDb,
} from "./elevatorDataOperations.js";

const elevatorManager = new ElevatorManager();
const router = Router();

router.use(express.json()); // Middleware to read JSON-data from POST req

router.post("/callElevator", async (req, res) => {
  const floor = req.body.floor;
  console.log("Received request body:", req.body);

  if (!floor) {
    console.log("Floor is missing. Sending 400 response.");
    res.status(400).json({ message: "Floor is missing." });
    return;
  }

  if (isNaN(floor)) {
    console.log("Floor is not a number. Sending 400 response.");
    res.status(400).json({ message: "Invalid floor. Must be a number." });
    return;
  }

  if (floor < 0 || floor > 10) {
    console.log("Floor is less than 0. Sending 400 response.");
    res
      .status(400)
      .json({ message: "Invalid floor. Must be greater than or equal to 0." });
    return;
  }

  // If the execution reaches here, the floor is valid

  // if (!floor || isNaN(floor) || floor < 0) {
  //   console.log("Invalid floor. Sending 400 response.");
  //   res.status(400).json({ message: "Invalid floor." });
  //   return;
  // }

  try {
    await elevatorManager.handleElevatorCalls(floor);
    res.send(`Calling elevator to floor ${floor}`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/elevator/status", async (req, res) => {
  try {
    const elevatorStatus = await getElevatorStatusInDb();
    res.json(elevatorStatus);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error:" });
  }
});

//Check if specific elevator is available
router.get("/elevator/available/:elevatorId", async (req, res) => {
  try {
    const elevatorId = parseInt(req.params.elevatorId);

    if (isNaN(elevatorId)) {
      res.status(400).json({ message: "Invalid elevatorId." });
      return;
    }

    const isAvailable = await isElevatorAvailableInDb(elevatorId);

    if (isAvailable) {
      res.send(`Elevator with ID ${elevatorId} is available.`);
    } else {
      res.send(`Elevator with ID ${elevatorId} is not available.`);
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error:" });
  }
});

export { router as app, elevatorManager };
export default router;
