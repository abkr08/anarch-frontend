import { useState, useEffect } from 'react';
import Game from './Game';
import { connectAndReconnect, subscribeToOwnChannel } from './websocket/websocket';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [name, setName] = useState('');
  const [route, setRoute] = useState('init');
  const [stompClient, setStompClient] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);

  useEffect(() => {
    const initializeWebSocketConnection = async () => {
      const client = await connectAndReconnect('John');
      setStompClient(client);
    }
    initializeWebSocketConnection()
  }, [])

  useEffect(() => {
    if (isRegistered) {
      // setRoute('game');
    }
  }, [isRegistered])

  const registerUser = () => {
    subscribeToOwnChannel(name, handleNotification);
    stompClient.send(`/socket-subscriber/register`, {}, name)
  }

  const handleNotification = (data) => {
    alert(data);
    let notification = JSON.parse(data.body);
    switch (notification.type) {
      case 'registration':
        if (notification.success) {
          setIsRegistered(true);
        }
        break;
      case 'player-hand':
        setPlayerHand(notification.hand);
        setRoute('game');
        break;
      default:
        console.log(data)
    }
  }

  const sendNotification = notification => {
    stompClient.send(`/socket-subscriber/${notification.to}`, {}, JSON.stringify(notification))
  }

  return (
    <div className="App">
      <div className="container bg-light bg-warning justify-content-center">
        { route === 'init' ? (
            <>
            <h1>Enter your name</h1>
            <input
              value={name}
              placeholder="Enter your name"
              onChange={e => setName(e.target.value)}
            />
            <button onClick={registerUser}>Continue</button>
            </>
        ): (
          <>
            <Game name={name} playerHand={playerHand} setRoute={setRoute} stompClient={stompClient}/>
          </>
        )}
      
      </div>
    </div>
  );
}

export default App;
