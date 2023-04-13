import { useState, useEffect } from 'react';
import Game from './Game';
import { connectAndReconnect, subscribeToOwnChannel } from './websocket/websocket';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [name, setName] = useState('');
  const [game, setGame] = useState('');
  const [route, setRoute] = useState('init');
  const [stompClient, setStompClient] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isDealer, setIsDealer] = useState(false);
  const [playerHand, setPlayerHand] = useState([]);
  const [undealtCard, setUndealtCard] = useState([]);
  const [registeredPlayers, setRegisteredPlayers] = useState([]);
  const [isWaitingForOpponents, setIsWaitingForOpponents] = useState(false);
  const [isBidPlaced, setIsBidPlaced] = useState(false);
  const [hasSetNumberOfPlayers, setHasSetNumberOfPlayers] = useState(false);
  const [shouldReconnect, setShouldReconnect] = useState(false);

  useEffect(() => {
    const initializeWebSocketConnection = async () => {
      const client = await connectAndReconnect(name, false, setShouldReconnect, handleNotification);
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
    const registrationObject = { name, gameType: game, type: 'register-user' };
    stompClient.send(`/socket-subscriber/register`, {}, JSON.stringify(registrationObject));
    setIsWaitingForOpponents(true);
  }

  const setNumberOfPlayers = (numberOfPlayersPlaying) => {
    const payload = { type: 'set-number-of-players', numberOfPlayersPlaying };
    stompClient.send(`/socket-subscriber/register`, {}, JSON.stringify(payload));
    setHasSetNumberOfPlayers(true);
  }

  const handleNotification = (data) => {
    let notification = JSON.parse(data.body);
    switch (notification.type) {
      case 'registration':
        if (notification.success) {
          setIsRegistered(true);
          setIsDealer(notification.isDealer);

        }
        break;
      case 'player-hand':
        setPlayerHand(notification.hand);
        setUndealtCard(notification.undealtCard);
        setRegisteredPlayers(notification.registeredPlayers);
        route !== 'game' && setRoute('game');
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
      {route === 'init' ? (
        <>
          {game ? (
            <>
              {game === "Anarchist Bomb" && isDealer && !hasSetNumberOfPlayers ? (
                <>
                  <h1>How many people are playing?</h1>
                  <div className="gameOptions">
                    <li style={{ margin: '10px auto', marginRight: '3px', }} onClick={() => setNumberOfPlayers(3)}>3</li>
                    <li style={{ margin: '10px 0' }} onClick={() => setNumberOfPlayers(4)}>4</li>
                  </div>
                </>
              ) :
                (
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
                    <button
                      className="register-user"
                      onClick={() => setGame('')}
                      disabled={isWaitingForOpponents}
                    >
                      Go Back
                    </button>
                  </>
                )}
            </>
          ) : (
            <>
              <h1>Which game would you like to play?</h1>
              <div className="gameOptions">
                <li style={{ margin: '10px auto', marginRight: '3px', }} onClick={() => setGame('Anarchy')}>Anarchy</li>
                <li style={{ margin: '10px 0' }} onClick={() => setGame('Anarchist Bomb')}>Anarchist Bomb</li>
              </div>
            </>
          )}
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
            setIsBidPlaced={setIsBidPlaced}
            game={game}
            setGame={setGame}
            shouldReconnect={shouldReconnect}
            setShouldReconnect={setShouldReconnect}
            isDealer={isDealer}
          />
        </>
      )}
    </div>
    // </div>
  );
}

export default App;
