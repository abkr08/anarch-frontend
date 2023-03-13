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
  const [undealtCard, setUndealtCard] = useState([]);
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [isWaitingForOpponents, setIsWaitingForOpponents] = useState(false);
  const [isBidPlaced, setIsBidPlaced] = useState(false)

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
    stompClient.send(`/socket-subscriber/register`, {}, name);
    setIsWaitingForOpponents(true);
  }

  const handleNotification = (data) => {
    let notification = JSON.parse(data.body);
    switch (notification.type) {
      case 'registration':
        if (notification.success) {
          setIsRegistered(true);
        }
        break;
      case 'player-hand':
        setPlayerHand(notification.hand);
        setUndealtCard(notification.undealtCard);
        setRegisteredPlayers(notification.registeredPlayers);
        setRoute('game');
        setIsWaitingForOpponents(false);
        break;
      case 'bid-placed':
        setIsBidPlaced(true);
        break;
      default:
        console.log(data)
    }
  }

  const sendNotification = notification => {
    stompClient.send(`/socket-subscriber/${notification.to}`, {}, JSON.stringify(notification))
  }

  return (
    <div className="container">
      {/* <div className="container bg-light bg-warning justify-content-center"> */}
      {route === 'init' ? (
        <>
          <h1>Enter your name</h1>
          <input
            value={name}
            placeholder="Enter your name"
            onChange={e => setName(e.target.value)}
            disabled={isWaitingForOpponents}
          />
          {isWaitingForOpponents && (
            <p className="waiting-text">Waiting for other users to join...</p>
          )}
          <button
            className="register-user"
            onClick={registerUser}
            disabled={!name || isWaitingForOpponents}
          >
            Continue
          </button>
        </>
      ) : (
        <>
          <Game
            name={name}
            playerHand={playerHand}
            undealtCard={undealtCard}
            setUndealtCard={setUndealtCard}
            registeredPlayers={registeredPlayers}
            setPlayerHand={setPlayerHand}
            setRoute={setRoute}
            stompClient={stompClient}
            isBidPlaced={isBidPlaced}
          />
        </>
      )}
    </div>
    // </div>
  );
}

export default App;
