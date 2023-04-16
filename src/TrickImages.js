import React, { Component } from 'react';

import Cards from './Cards';
import './App.css';

export default class Game extends Component {
  state = {
    selectedCard: '',
  }

  playTrick = () => {
    let { selectedCard } = this.state;
    let isBombThrown = false;
    const { cards, setPlayerHand, stompClient, handleSetGameState, name } = this.props;
    if (selectedCard === "Joker") {
      alert('Bomb thrown');
      isBombThrown = true;
    }

    const selectedCardIdx = cards.indexOf(selectedCard);

    handleSetGameState({ canPlayTrick: false });

    // Remove the selected card from the player's hand
    const updatedPlayerHand = [
      ...cards.slice(0, selectedCardIdx),
      ...cards.slice(selectedCardIdx + 1)
    ];
    setPlayerHand(updatedPlayerHand);

    // Send trick details to the backend
    const trickObject = { type: 'play-trick', player: name, trick: selectedCard, isBombThrown };
    stompClient.send('/socket-subscriber/play', {}, JSON.stringify(trickObject));
    this.setState({ selectedCard: '' });
  }

  handleClick = (card) => {
    // Do something when the image is clicked
    this.setState({ selectedCard: card });
  }
  render() {
    const { cards, activeScreen, allBidsPlaced, undealtCard,
      selectedBid, revealedCards, revealingCards, registeredPlayers,
      playedTrick, capturedCards, trickCount, canPlayTrick, handleSetGameState,
      showShowResultsButton, name, isDealer, playerCapturedCards, showCapturedCards,
      toggleShowCapturedCards, isBombThrown, arnachist, game
    } = this.props
    const { selectedCard } = this.state;
    return (
      <div className="play-trick-screen">
        <Cards
          cards={cards}
          activeScreen={activeScreen}
          cardClickedHandler={this.handleClick}
          selectedCard={selectedCard}
          bid={selectedBid}
          revealedCards={revealedCards}
          revealingCards={revealingCards}
          undealtCard={undealtCard}
          registeredPlayers={registeredPlayers}
          playingTrick={!canPlayTrick}
          playedTrick={playedTrick}
          capturedCards={capturedCards}
          trickCount={trickCount}
          name={name}
          isDealer={isDealer}
          playerCapturedCards={playerCapturedCards}
          toggleShowCapturedCards={toggleShowCapturedCards}
          showCapturedCards={showCapturedCards}
          isBombThrown={isBombThrown}
          arnachist={arnachist}
          game={game}
        />
        {selectedCard && <p style={{ fontWeight: 'bold', textAlign: 'center' }}>Selected Card: {selectedCard}</p>}
        {!allBidsPlaced && <p className="waiting-text">Waiting for other players to place their bids...</p>}
        {!canPlayTrick && <p className="waiting-text">Round in progress...</p>}
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <button
            className="bid-button"
            onClick={this.playTrick}
            disabled={!allBidsPlaced || !canPlayTrick || showShowResultsButton || !selectedCard}
          >
            Play trick
          </button>
          {showShowResultsButton && (
            <button
              className="bid-button"
              onClick={() => handleSetGameState({ activeScreen: 'result' })}
            >
              Show Results
            </button>
          )}
        </div>
      </div>
    )
  }
}