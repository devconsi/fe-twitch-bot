import React, { useEffect, useState, useRef } from "react";

import "./assets/App.css";
import Bar from "./Bar";

function App() {
  const [isPaused, setPause] = useState(true);
  const [ticket, setTicket] = useState();
  const [width, setWidth] = useState(100);

  const backendServerUrl = "https://merciful-comet-buttercup.glitch.me";
  const backendServerWebsocket = "wss://merciful-comet-buttercup.glitch.me";
  const ws = useRef(null);

  console.log(backendServerUrl);
  console.log(backendServerWebsocket);
  //Websocket functions

  function openBackendWebsocket(ticket) {
    if (!ws.current) return;

    // const backendSocket = new WebSocket(
    //   `${backendServerWebsocket}/?ticket=${ticket}`
    // );
    backendSocket = ws.current;

    backendSocket.onmessage = (event) => {
      if (isPaused) return;

      const eventData = JSON.parse(event.data);
      console.log(eventData);
      if (eventData.type == "PONG") {
        console.log ("pong boiz");
        setWidth(100);
      } else if (eventData.type == "MESSAGE") {
        console.log ("message recieved");
      } else if (eventData.type == "CHAT_COMMAND") {
        switch (eventData.message.command) {
          case "lurk":
            //lurkersQueue.push(eventData.message.username);
        }
      } else if (eventData.type == "POINTS_REDEMPTION") {
        switch (eventData.message.command) {
          case "Boop!":
            lurkersQueue.push(eventData.message.username);
            break;
          default:
            console.log(
              `got a points redemption for ${eventData.message.command}`
            );
            break;
        }
      }
    };

    return backendSocket;
  }

  useEffect(() => {
    async function getWebsocketTicket() {
      console.log(backendServerUrl);
      const response = await fetch(`${backendServerUrl}/ticket`);
      const data = await response.json();
      console.log(data);
      const ticketData  = data["ticket"]
      setTicket(ticketData);
      return ticketData;
    }

    getWebsocketTicket();
}, []);

  useEffect(() => {
    ws.current = new WebSocket(`${backendServerWebsocket}/?ticket=${ticket}`);
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => console.log("ws closed");

    const wsCurrent = ws.current;

    return () => {
      wsCurrent.close();
    };
  }, [ticket]);

  useEffect(() => {
    if (!ws.current) return;

    const websocketTicket = ticket;
    console.log(ws.current);
    console.log(`websocket ticket ${websocketTicket}`);
    openBackendWebsocket(websocketTicket);
  }, [isPaused]);

  return (
    <div className="App">
      <Bar width={width} setWidth={setWidth}/>

      <div>
        <button onClick={() => setPause(!isPaused)}>
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

export default App;
