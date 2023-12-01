//implement all crud operations in elevatorManager!
import { ElevatorModel } from "./elevatorModel.js";
import ElevatorManager from "./elevatorManager.js";

// ------------------- Initialization Methods ----------------------

const elevatorManager = new ElevatorManager();

export async function createElevatorsInDB() {
  const elevatorList = [];

  for (let i = 0; i < elevatorManager.numberOfElevators; i++) {
    elevatorList.push({
      elevatorNumber: i + 1,
      currentFloor: 0,
      currentStatus: "idle",
      destinationFloor: null,
      callQueue: [],
    });
  }

  try {
    const results = await ElevatorModel.insertMany(elevatorList);
    console.log("Elevators created successfully", results);
  } catch (error) {
    console.log("Error creating elevators", error.message);
  }
}

// ------------------- CRUD Operations -----------------------------
export async function moveToFloor(elevatorNumber, destinationFloor) {
  try {
    const elevator = await ElevatorModel.findOne({ elevatorNumber });

    if (!elevator) {
      console.error(`Elevator with number ${elevatorNumber} not found.`);
      return;
    }

    const travelTime = calculateTravelTime(
      elevator.currentFloor,
      destinationFloor
    );
    await callElevator(elevatorNumber, destinationFloor);

    // // Simulate travel time
    // await new Promise((resolve) => setTimeout(resolve, travelTime));

    await updateElevatorDB(elevatorNumber, destinationFloor, "idle");
  } catch (error) {
    console.error("An error occurred in moveToFloor:", error.message);
  }
}

function calculateTravelTime(currentFloor, destinationFloor) {
  if (isNaN(destinationFloor) || destinationFloor < 0) {
    throw new Error("Invalid destination floor.");
  }
  return Math.abs(destinationFloor - currentFloor) * 2000; // Placeholder value
}

export async function callElevator(elevatorNumber, destinationFloor) {
  try {
    const elevator = await ElevatorModel.findOne({ elevatorNumber });
    const currentFloor = elevator.currentFloor;

    const filter = { elevatorNumber };
    const update = {
      currentStatus:
        destinationFloor > currentFloor ? "moving_up" : "moving_down",
      destinationFloor: destinationFloor,
    };

    const updatedElevator = await ElevatorModel.findOneAndUpdate(
      filter,
      update,
      { new: true }
    );
    console.log(updatedElevator);

    console.log(
      `Elevator ${elevatorNumber} is moving to floor ${destinationFloor}.`
    );
  } catch (error) {
    console.error("An error occurred in callElevator:", error.message);
  }
}

export async function getElevatorStatusInDb() {
  const elevatorStatus = await ElevatorModel.find(
    {},
    "elevatorNumber currentFloor currentStatus destinationFloor"
  );
  return elevatorStatus;
}

export async function updateElevatorDB(
  elevatorNumber,
  currentFloor,
  currentStatus
) {
  return new Promise(async (resolve, reject) => {
    try {
      const filter = { elevatorNumber };
      const update = { currentFloor, currentStatus, destinationFloor: null };
      console.log("Updating elevator in the database:", filter, update);

      await ElevatorModel.findOneAndUpdate(filter, update, { new: true });
      console.log("Elevator updated successfully.");
      resolve();
    } catch (error) {
      console.error("Error updating elevator in the database:", error.message);
      reject(error);
    }
  });
}

export async function isElevatorAvailableInDb() {
  const elevator = await ElevatorModel.findOne({
    currentStatus: "idle",
  });
  return !!elevator; // Double exclamation to convert the result to a boolean
}

// ------------------- Queue Based Functions ------------------------

// IMPLEMENT SOMETHING SIMILAR HERE:
// this.checkQueueInterval = setInterval(() => this.processQueue(), 2000); // Check every 2 seconds

export async function insertCallToQueue(elevatorNumber, callFloor) {
  const filter = { elevatorNumber: elevatorNumber };
  const update = { $push: { callQueue: { floor: callFloor } } };
  await ElevatorModel.findByIdAndUpdate(filter, update);
}
export async function processQueue() {
  const elevators = await ElevatorModel.find({
    currentStatus: "idle",
  });
  const calls = await ElevatorModel.aggregate([
    { $unwind: "$callQueue" },
    { $sort: { "callQueue.floor": 1 } },
  ]);
  const movePromises = elevators.map(async (elevator) => {
    const call = calls.find((callInList) =>
      elevator.callQueue.some(
        (callInQueue) => callInQueue.floor === callInList.floor
      )
    );

    if (call) {
      await callElevatorToFloor(
        closestElevator.elevatorNumber,
        call.callQueue.floor
      );
      await removeCallFromQueue(
        closestElevator.elevatorNumber,
        call.callQueue.floor
      );
      console.log(
        `Elevator ${closestElevator.elevatorNumber} dispatched to floor ${call.callQueue.floor}.`
      );
    }
  });
  await Promise.all(movePromises);
}

export async function removeCallFromQueue(elevatorObjectId, callFloor) {
  const filter = { _id: elevatorObjectId };
  const update = { $pull: { callQueue: { floor: callFloor } } };
  await ElevatorModel.findByIdAndUpdate(filter, update);
}
