// src/Hooks/useSignalR.js
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import connection from "../../api/signalrConnection";

export function UseSignalR(userId) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const startConnection = async () => {
      try {
        if (connection.state === signalR.HubConnectionState.Disconnected) {
          await connection.start();
          // ✅ RegisterUser FIRST, then set connected
          await connection.invoke("RegisterUser", userId);
          setIsConnected(true);
          console.log("✅ SignalR Connected");

        } else if (connection.state === signalR.HubConnectionState.Connected) {
          await connection.invoke("RegisterUser", userId);
          setIsConnected(true);
        }
      } catch (err) {
        console.error("❌ SignalR Error:", err);
        // Retry after 5 seconds
        setTimeout(startConnection, 5000);
      }
    };

    startConnection();

    connection.onreconnected(async () => {
      console.log("🔄 Reconnected");
      await connection.invoke("RegisterUser", userId);
      setIsConnected(true);
    });

    connection.onreconnecting(() => {
      console.warn("⚠️ Reconnecting...");
      setIsConnected(false);
    });

    connection.onclose(() => {
      console.error("🔴 Connection closed");
      setIsConnected(false);
    });

  }, [userId]);

  return { isConnected, connection };
}