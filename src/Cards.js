import SharedDeck from './SharedDeck';
import "./App.css"

const images = require.context('../public/cards/', true);
export default function Cards({
  cards, activeScreen, cardClickedHandler, selectedCard, bid,
  revealedCards, revealingCards, undealtCard, registeredPlayers,
  playingTrick, playedTrick, capturedCards, trickCount, name, isDealer, playerCapturedCards,
  toggleShowCapturedCards, showCapturedCards, isBombThrown, arnachist, game
}) {
  return (
    <>
      {activeScreen !== 'place-bid' && (
        <>
          <div style={{ display: 'flex' }}>
            <li
              style={{ margin: '10px auto', marginRight: '3px', borderBottom: '1px solid black', pointerEvents: 'none' }}
            >
              {`${name} ${isDealer ? '(Dealer)' : ''}`}</li>
            <li style={{ margin: '10px auto', marginRight: '3px', borderBottom: '1px solid black' }}>{bid}</li>
            <li style={{ margin: '10px 0', borderBottom: '1px solid black' }}>{`Round ${trickCount}`}</li>
          </div>
          <SharedDeck
            cardSelected={selectedCard}
            revealedCards={revealedCards}
            revealingCards={revealingCards}
            undealtCard={undealtCard}
            registeredPlayers={registeredPlayers}
            playingTrick={playingTrick}
            playedTrick={playedTrick}
            capturedCards={capturedCards}
            isBombThrown={isBombThrown}
            arnachist={arnachist}
            game={game}
          />
        </>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="card-gridd">
          {cards.map((c, i) => {
            return (
              <img
                src={images(`./${c}.png`)}
                alt=''
                id={c}
                key={c}
                className={`cardd ${selectedCard === c && 'selected-card'} ${i !== 0 && 'rest'}`}
                onClick={activeScreen !== 'place-bid' ? () => cardClickedHandler(c) : null}
              />
            )
          })}
        </div>
        {playerCapturedCards?.length > 0 ? (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <div>
              {playerCapturedCards.map((c, i) => {
                const cardId = (c.trickPlayed + c.suit)
                return (
                  <img
                    src={images(`./${showCapturedCards ? cardId : 'backOfCard'}.png`)}
                    alt=''
                    id={c}
                    key={cardId}
                    className={`captured-card ${i !== 100 && 'restt'}`}
                    onClick={toggleShowCapturedCards}
                  />
                )
              })}
            </div>
            <span style={{ fontWeight: 'bold', marginLeft: '85px' }}>Captured cards</span>
          </div>
        ) : null}
      </div>
    </>
  )
}