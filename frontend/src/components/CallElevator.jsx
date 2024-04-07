import React, { useState } from "react";
import styled from "styled-components";

const CallContainer = styled.div`
  background-color: #007bff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 550px;
  height: 142px;
`;

const Headline = styled.h2`
  background-color: transparent;
  margin-bottom: 5px;
  text-align: center;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CallInput = styled.input`
  padding: 10px;
  margin: 0px;
  border-radius: 6px;
`;

const CallButton = styled.button`
  cursor: pointer;
  border-radius: 8px;
  background-color: #f4e603; /* Bright yellow */
  padding: 10px 20px;
  margin: 5px;
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

const MessageContainer = styled.div`
  height: 1px;
  margin: 10px 0;
  text-align: center;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  text-align: center;
  font-weight: bold;
`;

function CallElevator({ onElevatorCall, callMessage }) {
  const [floor, setFloor] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitCall = async () => {
    setFloor("");
    if (validateFloor(floor)) {
      await onElevatorCall(floor);
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a floor number between 1 and 10.");
    }
  };

  const validateFloor = (floor) => {
    const floorNumber = parseInt(floor);
    return !isNaN(floorNumber) && floorNumber >= 1 && floorNumber <= 10;
  };

  return (
    <CallContainer>
      <Headline>Call Elevator</Headline>
      <InputWrapper>
        <CallInput
          type="number"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          placeholder="Enter floor number"
        ></CallInput>
        <CallButton onClick={submitCall}>Call Elevator</CallButton>
      </InputWrapper>
      <MessageContainer>
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        {callMessage.message && <div>{callMessage.message}</div>}
      </MessageContainer>
    </CallContainer>
  );
}

export default CallElevator;
