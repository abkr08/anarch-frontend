import React, { Component } from "react";
import Cards from "./Cards";
import Button from "./Button";
import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const images = require.context('../public/cards/', true);
const mockRevealedCards = {'John': 'AH', 'Sam': '10D'};
export default function SharedDeck({
	cardSelected, revealedCards, revealingCards,
	undealtCard, registeredPlayers, playingTrick, playedTrick, capturedCards
}) {
	// const players = ['John', 'Sam', 'Mark', 'Kevin', 'Ian']
	// players.map(p => console.log(p, mockRevealedCards))
	
	const renderCard = (owner, cardId) => (
		<div className="shared-deck-container">
			<div className="shared-deck-card-container">
				<img
					src={images(`./${cardId}.png`)}
					alt=''
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
		<div className="shared-deck">
			{ undealtCard ? (
				<>{renderCard('Undealt Card', undealtCard)}</>
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
	)
}
