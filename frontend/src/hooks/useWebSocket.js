import { useEffect, useRef, useCallback } from "react";
import { useSimulationStore } from "../store/simulationStore";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/ws/simulation";

export function useWebSocket() {
  const ws                  = useRef(null);
  const { setState }        = useSimulationStore();

  const connect = useCallback(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onopen    = () => console.log("[WS] Connected to KernelFlow");
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState(data);
      } catch (e) {
        console.error("[WS] Failed to parse message", e);
      }
    };
    ws.current.onerror = (e) => console.error("[WS] Error:", e);
    ws.current.onclose = ()  => console.log("[WS] Disconnected");
  }, [setState]);

  const disconnect = useCallback(() => {
    ws.current?.close();
  }, []);

  const send = useCallback((message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return { send, disconnect, connect };
}
