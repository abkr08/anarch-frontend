import React, { Component } from 'react';

import Cards from './Cards';
import './App.css';

export default class Game extends Component {
  state = {
    selectedCard: '',
  }

  playTrick = () => {
    const { selectedCard, trickCount } = this.state;
    const { cards, setPlayerHand, stompClient, handleSetGameState } = this.props;
    const selectedCardIdx = cards.indexOf(selectedCard);

    handleSetGameState({ canPlayTrick: false });

    // Remove the selected card from the player's hand
    const updatedPlayerHand = [
      ...cards.slice(0, selectedCardIdx),
      ...cards.slice(selectedCardIdx + 1)
    ];
    setPlayerHand(updatedPlayerHand);

    // Send trick details to the backend
    const trickObject = { type: 'play-trick', player: this.props.name, trick: selectedCard, trickCount: trickCount + 1 };
		stompClient.send('/socket-subscriber/play', {}, JSON.stringify(trickObject));
    this.setState({ selectedCard: ''})
  }

  handleClick = (card) => {
    // Do something when the image is clicked
    this.setState({ selectedCard: card });
  }
  render() {
    const { cards, activeScreen, allBidsPlaced, undealtCard,
      selectedBid, revealedCards, revealingCards, registeredPlayers,
      playedTrick, capturedCards, trickCount, canPlayTrick
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
        />
        { selectedCard && <p style={{ fontWeight: 'bold', textAlign: 'center'}}>Selected Card: {selectedCard}</p> }
        { !allBidsPlaced && <p className="waiting-text">Waiting for other players to place their bids...</p>}
        { !canPlayTrick && <p className="waiting-text">Round in progress...</p>}
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <button
            className="bid-button"
            onClick={this.playTrick}
            disabled={!allBidsPlaced || !canPlayTrick}
          >
            Play trick
          </button>
        </div>
      </div>
    )
  }
}