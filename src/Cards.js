import SharedDeck from './SharedDeck';
import "./App.css"

const images = require.context('../public/cards/', true);
console.log(images)
export default function Cards({
  cards, activeScreen, cardClickedHandler, selectedCard, bid,
  revealedCards, revealingCards, undealtCard, registeredPlayers,
  playingTrick, playedTrick, capturedCards, trickCount,
}) {
	return (
		<>
		{activeScreen !== 'place-bid' && (
      <>
        <div style={{ display: 'flex'}}>
          <li style={{ margin: '10px auto', marginRight: '3px', borderBottom: '1px solid black'}}>{bid}</li>
          <li style={{ margin: '10px 0', borderBottom: '1px solid black'}}>{`Round ${trickCount}`}</li>
        </div>
        <SharedDeck
          cardSelected = {selectedCard}
          revealedCards={revealedCards}
          revealingCards={revealingCards}
          undealtCard={undealtCard}
          registeredPlayers={registeredPlayers}
          playingTrick={playingTrick}
          playedTrick={playedTrick}
          capturedCards={capturedCards}
        />
      </>
    )}
		<div className="card-gridd">
		{cards.map((c, i) => {
			 return (
      //  <div className="card-containers" onClick={() => cardClickedHandler(c)}>
				<img
					src={images(`./${c}.png`)}
					alt=''
					id={c}
          key={c}
					className={`cardd ${selectedCard === c && 'selected-card'} ${i !== 0 && 'rest'}`}
					onClick={activeScreen !== 'place-bid' ? () => cardClickedHandler(c) : null}
				/>
		//  </div>
       )
		})}
		</div>
		</>
	)
}