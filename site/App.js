import React, { useEffect, useState, useRef } from "react";

import "./assets/App.css";
import Bar from "./Bar";
import config from "./config.json"

function App() {
  const [isPaused, setPause] = useState(false);
  const [ticket, setTicket] = useState();
  const [width, setWidth] = useState(0);

  const backendServerUrl = config.BACKEND_SERVER_URL;
  const backendServerWebsocket = config.BACKEND_SERVER_WEBSOCKET;
  const upward = config.UPWARD_FACTOR;
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
        //sets value to upward config
        setWidth(upward);
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
    if(!ticket) return;

    ws.current = new WebSocket(`${backendServerWebsocket}/?ticket=${ticket}`);
    ws.current.onopen = () => console.log("ws opened");
    ws.current.onclose = () => {
      console.log("ws closed");
    }

    setWidth(100); //Initial state after setting ws
    const wsCurrent = ws.current;
    console.log(wsCurrent);

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
  
    const interval = setInterval(() => {
      const newWidth = width - config.DECREASE_PERCENTAGE;
      console.log(`decreasing to: ${newWidth}`);
      if(newWidth > 0){
        setWidth(newWidth);//every interval amount of time decrease x amount of %
      } else{
        clearInterval(interval);
      }
    }, config.DECREASE_TIME * 1000); //amount of time from interval
    return () => clearInterval(interval);
  }, [width]);

  return (
    <div className="App">
      <Bar width={width} setWidth={setWidth}/>

      <div>
        <button hidden={true} onClick={() => setPause(!isPaused)}>
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </div>
  );
}

export default App;
