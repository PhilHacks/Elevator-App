const prompt = require("prompt-sync")();

//1.Elevator Class(blueprint) with properties(attributes)
class Elevator {
  constructor(id) {
    this.id = id;
    this.currentFloor = 1;
    this.currentStatus = "idle"; //  lagrar hissens status idle, movingUp, movingDown
    this.isMoving = false;
    this.floorTravelTime = 2000; // 2sec
    this.numFloors = 10;
    this.statusHistory = [];
  }

  //1.1 Method to move Elevator
  goToFloor(destinationFloor) {
    // Calculate travel time
    const travelTime =
      Math.abs(destinationFloor - this.currentFloor) * this.floorTravelTime;

    // Set the elevator to moving state
    if (destinationFloor > this.currentFloor) {
      this.currentStatus = "movingUp";
    } else if (destinationFloor < this.currentFloor) {
      this.currentStatus = "movingDown";
    }
    this.isMoving = true;
    console.log(
      "Moving from floor",
      this.currentFloor,
      "to floor",
      destinationFloor
    );

    // Use setTimeout to simulate travel time and update the current floor
    setTimeout(() => {
      this.currentFloor = destinationFloor;
      this.isMoving = false;
      console.log("Arrived at floor", this.currentFloor);

      // Update the status array
      this.statusHistory.push({
        floor: this.currentFloor,
        isMoving: this.isMoving,
        currentStatus: this.currentStatus,
      });
    }, travelTime);
  }
}

//2. Elevator System
class ElevatorSystem {
  constructor(numberOfElevators, numberOfFloors) {
    this.numberOfElevators = numberOfElevators;
    this.numFloors = numberOfFloors;
    this.elevatorList = []; // Lagrar hissarna i en array

    // Skapa alla hissar och lägg till dem i listan
    for (let i = 0; i < numberOfElevators; i++) {
      this.elevatorList.push(new Elevator());
    }
  }

  // 2.1 Metod för att visa status på alla hissar
  displayElevatorStatus() {
    console.log("Elevator Status:");
    for (let i = 0; i < this.elevatorList.length; i++) {
      const elevator = this.elevatorList[i];
      console.log(
        `Elevator ${i + 1}: Current Floor: ${
          elevator.currentFloor
        }, isMoving: ${elevator.isMoving}, currentStatus: ${
          elevator.currentStatus
        }`
      );
    }
  }

  // 2.2 Metod för att hantera anrop till en hiss
  callElevator(destinationFloor) {
    let closestElevator = null;
    let closestDistance = Infinity;

    //Hitta närmaste hiss genom att loopa elevatorList
    for (let i = 0; i < this.elevatorList.length; i++) {
      const elevator = this.elevatorList[i];
      const distanceToFloor = Math.abs(
        elevator.currentFloor - destinationFloor
      );

      if (!elevator.isMoving && distanceToFloor < closestDistance) {
        closestElevator = elevator;
        closestDistance = distanceToFloor;
      }
    }

    if (closestElevator) {
      //Flytta närmaste hiss genom att kalla på goToFloor
      closestElevator.goToFloor(destinationFloor);
    }
    //Uppdatera hissarnas status
    this.displayElevatorStatus();
    console.log(`Elevator has moved to ${destinationFloor}.`);
  }

  //2.3 Metod för att hantera flera hissanrop när alla hissar är upptagna
  handleCalls(destinationFloor) {
    // 1. Letar efter lediga hissar som inte rör sig
    const idleElevator = this.displayElevatorStatus;

    // 2. Använd en algoritm för prioritering om inga lediga hissar hittas

    // 3. Flytta den valda hissen till den önskade destinationen

    // Uppdatera hissarnas status
    this.displayElevatorStatus();
    console.log(`Elevator has moved to ${destinationFloor}.`);
  }

  // 2.4Metod för att undvika dubbla hissanrop
  avoidDuplicateCalls(floor) {
    // 1. Kontrollera om en hiss redan har samma destination
    // 2. Om ingen hiss har samma destination, välj en hiss baserat på prioritering
    // 3. Flytta den valda hissen till den undvikna destinationen
  }
}
