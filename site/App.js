import React, { useEffect, useState, useRef } from "react";

import "./assets/App.css";
import Bar from "./Bar";

function App() {
  const [isPaused, setPause] = useState(false);
  const [ticket, setTicket] = useState();
  const [width, setWidth] = useState(100);

  const backendServerUrl = "https://merciful-comet-buttercup.glitch.me";
  const backendServerWebsocket = "wss://merciful-comet-buttercup.glitch.me";
  const ws = useRef(null);


  //Websocket functions

  function openBackendWebsocket() {
    if (!ws.current) return;

    let backendSocket = ws.current;

    backendSocket.onmessage = (event) => {
      if (isPaused) return;

      const eventData = JSON.parse(event.data);
      console.log(eventData);
      if (eventData.type == "PONG") {
        //Ignore PONG
      } else if (eventData.type == "FOLLOW") {
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
    console.log(backendServerUrl);
    console.log(backendServerWebsocket);

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
    ws.current.onclose = () => {
      console.log("ws closed");
    }

    const wsCurrent = ws.current;

    openBackendWebsocket(); //NOT sure if 
    return () => {
      wsCurrent.close();
    };
  }, [ticket]);

  useEffect(() => {
    if (!ws.current) return;
  
    const interval = setInterval(() => {
      let backendSocket = ws.current;
      if(backendSocket){
        const data = {"type": "ping", "message":"ping"}
        backendSocket.send(JSON.stringify({"message":"ping"}));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [ticket]);

  useEffect(() => {
    if (!ws.current) return;


    //openBackendWebsocket(); //NOT sure if 
  }, [isPaused]); // would it be ws?

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
