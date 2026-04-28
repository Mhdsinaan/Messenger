// src/api/signalrConnection.js
import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5048/chatHub", {
    withCredentials: true,
  })
  .withAutomaticReconnect([0, 2000, 5000, 10000])
  .configureLogging(signalR.LogLevel.Debug)
  .build();

export default connection;