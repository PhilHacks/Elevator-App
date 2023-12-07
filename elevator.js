// import { updateElevatorDB } from "./elevatorDataOperations.js";

// class Elevator {
//   constructor(elevatorId) {
//     this.elevatorId = elevatorId;
//     this.currentFloor = 1;
//     this.currentStatus = "idle"; //  lagrar hissens status idle, movingUp, movingDown
//     this.isMoving = false;
//     this.floorTravelTimeMs = 2000; // 2sec
//     // this.statusHistory = [];
//   }

//   async moveToFloor(destinationFloor) {
//     return new Promise(async (resolve, reject) => {
//       try {
//         await this.calculateTravelTime(destinationFloor);
//         await this.setToMovingState(destinationFloor);
//         await this.simulateTravelTime(destinationFloor);

//         await updateElevatorDB(
//           this.elevatorId,
//           this.currentFloor,
//           this.currentStatus,
//           destinationFloor
//           // callQueue
//         );
//         resolve();
//       } catch (error) {
//         console.error("An error occurred in moveToFloor:", error.message);
//         reject(error);
//       }
//     });
//   }

//   async calculateTravelTime(destinationFloor) {
//     if (isNaN(destinationFloor) || destinationFloor < 1) {
//       throw new Error("Invalid destination floor.");
//     }
//     return (
//       Math.abs(destinationFloor - this.currentFloor) * this.floorTravelTimeMs
//     );
//   }

//   async setToMovingState(destinationFloor) {
//     if (destinationFloor > this.currentFloor) {
//       this.currentStatus = "moving_up";
//     } else if (destinationFloor < this.currentFloor) {
//       this.currentStatus = "moving_down";
//     }
//     this.isMoving = true;
//     console.log(
//       `Elevator ${this.elevatorId} is moving from floor`,
//       this.currentFloor,
//       "to floor",
//       destinationFloor
//     );
//     return this;
//   }

//   async simulateTravelTime(destinationFloor) {
//     return new Promise((resolve, reject) => {
//       const travelTime = this.calculateTravelTime(destinationFloor);

//       setTimeout(async () => {
//         try {
//           this.currentFloor = destinationFloor;
//           this.currentStatus = "idle";

//           await updateElevatorDB(
//             this.elevatorId,
//             this.currentStatus,
//             destinationFloor
//           );

//           console.log("Simulation completed successfully.");
//           resolve();
//         } catch (error) {
//           console.error("An error occurred during simulation:", error.message);
//           reject();
//         }
//       }, travelTime);
//     });
//   }

//   // updateStatusArr() {
//   //   this.statusHistory.push({
//   //     floor: this.currentFloor,
//   //     isMoving: this.isMoving,
//   //     currentStatus: this.currentStatus,
//   //   });
//   //   return this.statusHistory;
//   // }
// }

// export default Elevator;
