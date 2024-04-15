import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import ElevatorStatus from "./components/ElevatorStatus";
import CallElevator from "./components/CallElevator";
import UpdateStatus from "./components/UpdateStatus";
import CallQueue from "./components/CallQueue";
import {
  getElevators,
  callElevator,
  updateElevatorStatus,
} from "./services/ElevatorServices";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  margin-top: 5px;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
}

body, #root { 
  height: 100%; 
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7f1ff; 
  color: #ffffff; 
  
}
`;
const MaintenanceBtn = styled.button`
  display: block;
  cursor: pointer;
  border-radius: 8px;
  background-color: #f4e603; /* Bright yellow */
  padding: 10px 20px;
  margin: 5px auto;
  border: none;
  font-size: 16px;
  font-weight: bold;

  &:hover {
    background-color: #dbcb05;
  }

  &:active {
    background-color: #c2b204;
  }
`;

function App() {
  const [elevators, setElevators] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [queue, setQueue] = useState([]);
  const [callMessage, setCallMessage] = useState("");
  const [socketMessage, setSocketMessage] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);

  const fetchElevatorStatus = async () => {
    try {
      const data = await getElevators();
      setElevators(data);
      if (data.length > 0) {
        setQueue(data[0].callQueue);
      }
      setStatusMessage("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch elevator status";
      setStatusMessage(errorMessage);
    }
  };

  const handleCallElevator = async (floor) => {
    try {
      const response = await callElevator(floor);
      console.log("Server response data:", response);
      if (response && response.message) {
        setCallMessage(response.message);
      } else {
        setCallMessage(
          "Received an unexpected response format from the server."
        );
      }
      fetchElevatorStatus();
    } catch (error) {
      console.error("Call Elevator Error:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setCallMessage(error.response.data.message);
      } else {
        setCallMessage("Something went wrong");
      }
    } finally {
      setTimeout(() => setCallMessage(""), 3000);
    }
  };

  const handleUpdateElevatorStatus = async (elevatorId, newStatus) => {
    try {
      const response = await updateElevatorStatus(elevatorId, newStatus);
      setUpdateMessage(response.message);
      fetchElevatorStatus();
    } catch (error) {
      setUpdateMessage(error.response?.data?.message || "Something went wrong");
    } finally {
      setTimeout(() => setUpdateMessage(""), 3000);
    }
  };

  const toggleUpdateStatusVisibility = () => {
    setShowUpdateStatus((prevShow) => !prevShow);
  };

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("elevatorArrival", (data) => {
      console.log("Elevator arrived:", data);
      setSocketMessage(data.message);
      setTimeout(() => setSocketMessage(""), 3000);
    });

    return () => {
      socket.off("elevatorArrival");
    };
  }, []);

  useEffect(() => {
    fetchElevatorStatus();
    const statusInterval = setInterval(fetchElevatorStatus, 2000);
    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div>
      <GlobalStyle />
      <ElevatorStatus elevators={elevators} message={statusMessage} />
      <CallQueue queue={queue} />
      <CallElevator
        onElevatorCall={handleCallElevator}
        callMessage={callMessage}
        socketMessage={socketMessage}
      />
      <MaintenanceBtn onClick={toggleUpdateStatusVisibility}>
        Maintenance Features
      </MaintenanceBtn>
      {showUpdateStatus && (
        <UpdateStatus
          onUpdateElevatorStatus={handleUpdateElevatorStatus}
          message={updateMessage}
        />
      )}
    </div>
  );
}

export default App;
