import express from "express";
import { dbConnection } from "./databaseConnect.js";
import { checkIfElevatorDocumentExist } from "./elevatorModel.js";
import routes from "./routes.js";

export const app = express();

try {
  const port = process.env.PORT || 3000;

  //make sure connetion to db and that ElevatorDoc exists before server starts
  dbConnection.then(() => {
    checkIfElevatorDocumentExist();
    app.use(routes);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  });
} catch (error) {
  console.error(
    "An error occurred during server initialization:",
    error.message
  );
}
