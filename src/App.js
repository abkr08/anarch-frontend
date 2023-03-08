import { useState, useEffect } from 'react';
import Game from './Game';
import { connectAndReconnect, subscribeToOwnChannel } from './websocket/websocket';
import TrickImages from './TrickImages';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [name, setName] = useState('');
  const [route, setRoute] = useState('init');
  const [stompClient, setStompClient] = useState(null);

  useEffect(() => {
    const initializeWebSocketConnection = async () => {
      const client = await connectAndReconnect('John');
      setStompClient(client);
    }
    initializeWebSocketConnection()
  }, [])

  const registerUser = () => {
    // subscribeToOwnChannel(name);
    stompClient.send(`/socket-subscriber/register`, {}, JSON.stringify(name))
    setRoute('game')
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
            {/* <Game name={name} setRoute={setRoute} /> */}
            <TrickImages name={name} setRoute={setRoute} />
          </>
        )}
      
      </div>
    </div>
  );
}

export default App;
