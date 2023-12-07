import {
  callElevator,
  isElevatorAvailableInDb,
  getElevatorStatusInDb,
  insertCallToQueue,
  updateElevatorDB,
} from "./elevatorDataOperations.js";

class ElevatorManager {
  constructor() {
    this.numberOfFloors = 10;
    this.floorTravelTimeMs = 2000; // 2 seconds
    this.numberOfElevators = 3;
  }

  // ------------------- Core Functionality Methods ------------------

  async handleElevatorCalls(destinationFloor) {
    // Log values to troubleshoot
    console.log("destinationFloor:", destinationFloor);

    try {
      this.checkInvalidFloorReq(destinationFloor);
      const elevatorOnFloor = await this.checkIfElevatorOnFloor(
        destinationFloor
      );

      if (elevatorOnFloor) {
        console.log(`Elevator already at floor ${destinationFloor}`);
        return;
      }

      const closestElevatorNumber = await this.findClosestElevator(
        destinationFloor
      );
      console.log("Closest elevator:", closestElevatorNumber);

      const isAvailable = await isElevatorAvailableInDb();
      console.log("Elevator availability:", isAvailable);

      if (isAvailable && closestElevatorNumber !== null) {
        await callElevator(closestElevatorNumber, destinationFloor);
        console.log(
          `Calling elevator ${closestElevatorNumber} to floor ${destinationFloor}`
        );
        await this.simulateTravelTime(closestElevatorNumber, destinationFloor);
      } else {
        await insertCallToQueue(destinationFloor);
        console.log(`Call added to queue for floor ${destinationFloor}.`);
      }
    } catch (error) {
      console.error("An error occurred in handleCalls:", error.message);
    }
  }

  checkInvalidFloorReq(destinationFloor) {
    if (destinationFloor < 0 || destinationFloor > this.numberOfFloors) {
      throw new Error("Invalid floor requested.");
    }
  }

  async checkIfElevatorOnFloor(destinationFloor) {
    const elevatorStatus = await getElevatorStatusInDb();
    return elevatorStatus.some(
      (elevator) =>
        elevator.destinationFloor === destinationFloor &&
        elevator.currentStatus === "idle"
    );
  }

  async findClosestElevator(destinationFloor) {
    try {
      const elevatorStatus = await getElevatorStatusInDb();
      const idleElevators = elevatorStatus.filter(
        (elevator) => elevator.currentStatus === "idle"
      );

      const sortedElevators = this.sortIdleElevatorsByDistance(
        idleElevators,
        destinationFloor
      );

      const closestElevator = sortedElevators[0];

      return closestElevator ? closestElevator.elevatorNumber : null;
    } catch (error) {
      console.error("An error occurred in findClosestElevator:", error.message);
    }
  }

  async simulateTravelTime(elevatorNumber, destinationFloor) {
    try {
      const travelTime = this.calculateTravelTime(
        destinationFloor,
        elevatorNumber
      );

      console.log(`Simulating travel time for elevator ${elevatorNumber}.`);

      // Simulate travel time
      await new Promise((resolve) => setTimeout(resolve, travelTime));

      console.log(`Simulation completed for elevator ${elevatorNumber}.`);
      // Update elevator status after simulation
      await updateElevatorDB(elevatorNumber, destinationFloor, "idle");

      console.log(`Elevator ${elevatorNumber} simulation completed.`);
    } catch (error) {
      console.error("An error occurred in simulateTravelTime:", error.message);
    }
  }

  async callElevatorWithSimulation(elevatorNumber, destinationFloor) {
    try {
      const travelTime = this.calculateTravelTime(
        destinationFloor,
        elevatorNumber
      );

      await callElevator(elevatorNumber, destinationFloor);
      console.log(
        `Calling elevator ${elevatorNumber} to floor ${destinationFloor}`
      );

      // Simulate travel time
      await new Promise((resolve) => setTimeout(resolve, travelTime));

      await this.updateElevatorDBAfterSimulation(
        elevatorNumber,
        destinationFloor,
        "idle"
      );
    } catch (error) {
      console.error(
        "An error occurred in callElevatorWithSimulation:",
        error.message
      );
    }
  }

  calculateTravelTime(destinationFloor, elevatorNumber) {
    // Implement your calculation logic
    return Math.abs(destinationFloor - elevatorNumber) * this.floorTravelTimeMs;
  }

  async updateElevatorDBAfterSimulation(
    elevatorNumber,
    destinationFloor,
    currentStatus
  ) {
    try {
      await updateElevatorDB(elevatorNumber, destinationFloor, currentStatus);
    } catch (error) {
      console.error(
        "An error occurred in updateElevatorDBAfterSimulation:",
        error.message
      );
    }
  }

  // ------------------- Elevator Status Methods ---------------------

  async isElevatorAvailable(elevatorId) {
    const elevatorStatus = await getElevatorStatusInDb();
    return elevatorStatus.some(
      (elevator) =>
        elevator.currentFloor === elevatorId &&
        elevator.currentStatus === "idle"
    );
  }

  // ------------------- Utility Methods ----------------------------

  sortIdleElevatorsByDistance(elevators, destinationFloor) {
    return elevators.sort(
      (a, b) =>
        Math.abs(a.currentFloor - destinationFloor) -
        Math.abs(b.currentFloor - destinationFloor)
    );
  }
}

export default ElevatorManager;
