# 🛗 Elevator-App-MongoDb

## Table of Contents

- [Project Overview](#project-overview)
- [Installation and Setup](#installation-and-setup)
- [Project Features](#project-features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Project Overview

**Project Name:** ElevatorApp  
**Description:** ElevatorApp is a Node.js application for managing a network of elevators. This version uses MongoDB with Mongoose for data storage and management. It provides API endpoints for calling elevators to specific floors, checking elevator availability, and tracking elevator status.  The frontend, built with React, fully interacts with the functionalities of the backend.

## Installation and Setup

### Requirements:

- Node.js
- npm (Node Package Manager)
- MongoDB

### Installation:

### Installing MongoDB Community Server and MongoDB Compass

To run this project, you need to install MongoDB, which is used as the primary database, and MongoDB Compass, which is an optional GUI that helps manage your MongoDB databases.

1. Download and install the **MongoDB Community Server** from the [MongoDB Download Center](https://www.mongodb.com/try/download/community). Choose the version that is compatible with your operating system. This server is where your MongoDB databases will reside.

2. During the installation, you'll also have the option to install **MongoDB Compass**. Install it if you prefer a graphical interface to manage your databases.

After installation, the application will connect to MongoDB using a URI defined in your environment variables. Ensure that you have a `.env` file in your project root with the `MONGODB_URI` variable set to your MongoDB connection string, such as:

```env
MONGODB_URI=mongodb://localhost:27017/elevatorSystem
```




#### Setting Up the Application

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/PhilHacks/Elevator-App-MongoDb.git
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd Elevator-App-MongoDb
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Start the Servers:**
   Launch both the backend and frontend servers with a simple set of commands. First, start the backend:
   ```bash
   cd backend
   npm start
   ```
   This command runs the backend server, accessible at `http://localhost:5000`. 

   Next, in a new terminal window, start the frontend by navigating to the frontend directory from the project root and running:
   ```bash
   cd frontend
   npm start
   ```
   This will open the frontend interface in your default web browser, typically at `http://localhost:3000`. If it doesn't automatically open, manually navigate to this URL.



## Project Features

This application offers several API endpoints for managing and tracking elevators:

- `POST /callElevator`                 - Call an elevator to a specific floor. 
- `GET /elevator/status`               - Retrieve the status of all elevators directly from MongoDB.
- `GET /callqueue/`                    - Fetch the call queue table that is stored in MongoDB.
- `GET /elevator/available/:elevatorId` - Check if a specific elevator is available by querying its status in MongoDB.
- `PUT /updateElevatorStatus`          - Update the status of an elevator

## Project Structure

#### Backend

```
backend/
├── src/
│   ├── crudOperations.js  
│   ├── dbConnect.js       
│   ├── elevatorManager.js 
│   ├── elevatorModel.js   
│   └── routes.js         
├── main.js                

```

#### Frontend

```
frontend/
├── src/
│   ├── components/
│   │   ├── CallElevator.jsx
│   │   ├── CallQueue.jsx
│   │   ├── ElevatorStatus.jsx
│   │   └── UpdateStatus.jsx
│   ├── services/
│   │   └── ElevatorServices.js
│   ├── App.css
│   ├── App.js
│   ├── App.test.js
│   ├── index.css
│   └── index.js
├── .gitignore
├── README.md
├── package-lock.json
└── package.json
```

## Image of Elevator App

![Elevator App Interface](./backend/img/appUI.png)

## Technologies Used
- Backend: Node.js, Express.js, MongoDB (Mongoose)
- Frontend: React, Axios, Styled-Components.

