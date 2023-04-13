import React, { Component } from "react";
import Cards from "./Cards";
import Button from "./Button";
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const images = require.context('../public/cards/', true);
const mockRevealedCards = {'John': 'AH', 'Sam': '10D'};
export default function SharedDeck({
	cardSelected, revealedCards, revealingCards, arnachist,
	undealtCard, registeredPlayers, playingTrick, playedTrick, capturedCards, game, isBombThrown
}) {
	// const registeredPlayers = ['John', 'Sam', 'Mark', 'Kevin', 'Ian'];
	// const undealtCard = "Joker";
	// players.map(p => console.log(p, mockRevealedCards))
	
	const renderCard = (owner, cardId) => (
		<div>
			<div className="shared-deck-card-container">
				<img
					src={images(`./${cardId}.png`)}
					alt=''
					key={cardId}
					// id={c}
					// className="card"
				/>
			</div>
			<span>
				{owner}
			</span>
			{
				revealingCards && capturedCards[owner]?.length > 0 && (
					<span style={{ color: 'green', fontWeight: 'bold'}}>
						{' '} captures {' '} {capturedCards[owner].map(c => c.trickPlayed + c.suit).join(', ')}
					</span>
				)
			}
		</div>
	)
	return (
		<div className="shared-deck-container">
			{ isBombThrown && (
				<p style={{ color: 'tomato', fontWeight: 'bold'}}>Bomb has been thrown by {' ' + arnachist}, so capturing order will be reversed!</p>
			)}
			<div className="shared-deck">
			{ undealtCard ? (
				<>{renderCard(game === 'Anarchy' ? 'Undealt Card' : "Odd Card", undealtCard)}</>
			) :
			null}
			{
				registeredPlayers.map(p => {
					let imageSource = 'blank';
					if (playedTrick[p]) {
						imageSource = 'backOfCard';
					} else if ((revealingCards && revealedCards[p])){
						imageSource = revealedCards[p];
					}
					return renderCard(p, imageSource);
				})
			}
		</div>
		</div>
	)
}
