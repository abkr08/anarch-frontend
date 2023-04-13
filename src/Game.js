import React, { Component } from 'react';

import './App.css';

import Cards from './Cards';
import TrickImages from './TrickImages';
import Result from './Result';

const cardss = ['6H', '6C', '7D', '9C', '10H', '9S', '4S', '9H', 'JC', 'AD'];

const commonBids = [
	{ name: 'Spades', value: 'SPADES' },
	{ name: 'Clubs', value: 'CLUBS' },
	{ name: 'Diamonds', value: 'DIAMONDS' },
	{ name: 'Hearts', value: 'HEARTS' },
]

const anarchyBids = [
	...commonBids,
	{ name: 'No suit', value: 'NO_SUIT' },
	{ name: 'Misère', value: 'MISERE' }
];

const anarchistBombBids = [
	...commonBids,
	{ name: 'Cards', value: 'CARDS' },
	{ name: 'Black', value: 'BLACK' },
	{ name: 'Red', value: 'RED' },
	{ name: 'Best', value: 'BEST' },
	{ name: 'Overs', value: 'OVERS' },
	{ name: 'Unders', value: 'UNDERS' },
];

export default class Game extends Component {

	constructor() {
		super();
		this.state = {}

		this.clearState = {
			selectedBid: '',
			hand: [],
			activeScreen:
				// 'result',
				'place-bid',
			placingBid: false,
			allBidsPlaced: false,
			revealedCards: {},
			revealingCards: false,
			canPlayTrick: true,
			playedTrick: {},
			capturedCards: {},
			trickCount: 1,
			isBombThrown: false,
			arnachist: '',
			showShowResultsButton: false,
			playerCapturedCards: [],
			showCapturedCards: false
		}

		this.state = { ...this.clearState }
	}

	componentDidMount() {
		this.connectToGameRoom();
	}

	connectToGameRoom = () => {
		// Subscribe to the room the user will be playing in (/play for now)
		this.props.stompClient?.subscribe(`/socket-publisher/play`, notification => {
			this.handleRoomNotifications(notification);
		});
	}

	componentDidUpdate() {
		const { isBidPlaced, shouldReconnect, setShouldReconnect, setUndealtCard, undealtCard } = this.props;
		const { activeScreen, isBombThrown } = this.state;

		if (activeScreen !== 'play-trick' && isBidPlaced && activeScreen !== 'result') {
			this.setState({ activeScreen: 'play-trick' });
		}

		if (shouldReconnect) {
			debugger;
			this.connectToGameRoom();
			setShouldReconnect(false);
		}

		if (isBombThrown && undealtCard) {
			setUndealtCard('');
		}


	}

	handleSetGameState = newState => this.setState(newState);

	addDelay = (callBack, delay) => {
		setTimeout(callBack, delay);
	}

	handleRoomNotifications = (data) => {
		const { setUndealtCard, isDealer, stompClient, name, setGame, setIsBidPlaced, setPlayerHand } = this.props;
		let notification = JSON.parse(data.body);
		switch (notification.type) {
			case 'all-bids-placed':
				this.setState({ allBidsPlaced: true });
				break;
			case 'reveal-cards':
				this.addDelay(this.setState({
					revealedCards: notification.playedTricks,
					revealingCards: true, playedTrick: {},
					isBombThrown: notification.isBombThrown,
					arnachist: notification.arnachist,
				}), 5000)
				break;
			case 'played-trick':
				this.setState(prevState => ({
					playedTrick: {
						...prevState.playedTrick,
						[notification.player]: true,
						...!prevState.playedTrick.Dummy && {
							Dummy: !!notification.dummy
						}
					},
				}));
				break;
			case 'capture-cards':
				this.setState(prevState => (
					{ 
						capturedCards: notification.capturedCards,
						playerCapturedCards: [...prevState.playerCapturedCards, ...notification.capturedCards[name]],
						playedTrick: {}
					}
					));
				break;
			case 'next-round':
				setTimeout(() => this.setState({
					trickCount: notification.trickCount, canPlayTrick: true, revealedCards: {},
					revealingCards: false, capturedCards: {}, isBombThrown: false, anarchist: ''
				}), 10000)
				setUndealtCard(notification.undealtCard);
				break;
			case "end-of-round":
				// Sort players based on scores
				const sortedScores = Object.keys(notification.scores).map(player => ({
					name: player, score: notification.scores[player], bid: notification.bids[player]
				})).sort((a, b) => b.score - a.score);
				this.setState({
					scores: sortedScores,
					roundCapturedCards: notification.capturedCards,
					canPlayTrick: true,
					showShowResultsButton: true,
					isBombThrown: false,
					anarchist: ''
				});
				break;
			case "play-again-request":
				if (!isDealer) {
					const response = window.confirm("Play again?");
					const payload = { type: "confirm-play-again", response, player: name  }
					stompClient.send('/socket-subscriber/play', {}, JSON.stringify(payload));

					if (response) {
						setIsBidPlaced(false);
						setPlayerHand([])
						this.setState({ ...this.clearState });
					} else {
						setGame('');
					}

				}
				break;
			default:
				console.log(data)
		}
	}

	placeBid = () => {
		const { selectedBid } = this.state;
		this.setState({ placingBid: true });
		const bidObject = { type: 'place-bid', player: this.props.name, bid: selectedBid };
		this.props.stompClient.send('/socket-subscriber/play', {}, JSON.stringify(bidObject));
	}

	playAgain = () => {
		const { setIsBidPlaced, isDealer, setPlayerHand, stompClient } = this.props;

		if (isDealer) {
			const payload = { type: 'play-again' };
			stompClient.send('/socket-subscriber/play', {}, JSON.stringify(payload));
		}
		setIsBidPlaced(false);
		setPlayerHand([])
		this.setState({ ...this.clearState });
	}

	endGame = () => {
		const { setGame, setRoute, stompClient, setIsBidPlaced, setIsDealer, setRegisteredPlayers, name } = this.props;
		const payload = { type: 'end-game', player: name };
		stompClient.send('/socket-subscriber/play', {}, JSON.stringify(payload));
		setGame('');
		setRoute('init');
		setIsBidPlaced(false);
		setIsDealer(false);
		setRegisteredPlayers([]);
	}

	toggleShowCapturedCards = () => this.setState(prevState => ({ showCapturedCards: !prevState.showCapturedCards}));

	renderOptions = () => {
		const { game, playerHand } = this.props;
		const bidOptionsToRender = game === 'Anarchy' ?
			anarchyBids :
			anarchistBombBids;

		const { selectedBid, placingBid } = this.state;
		return (
			<div style={{ display: 'flex', flexFlow: 'column' }}>
				<div className="list-container">
					{bidOptionsToRender.map(bid => (
						<li
							onClick={() => this.setState({ selectedBid: bid.value })}
							id={selectedBid === bid.value ? 'selectedBid' : ''}
						>
							{bid.name}
						</li>
					))}
				</div>
				{placingBid && <p className="waiting-text">Placing Bid...</p>}
				<button
					className="bid-button"
					onClick={this.placeBid}
					disabled={placingBid || !playerHand.length}
				>
					Place Bid
				</button>
			</div>
		)
	}

	render() {
		const { playerHand, name, setRoute, setPlayerHand,
			stompClient, undealtCard, registeredPlayers, setUndealtCard, isDealer, game
		} = this.props;
		const { activeScreen, allBidsPlaced, revealedCards,
			canPlayTrick, selectedBid, revealingCards, playedTrick, capturedCards,
			trickCount, scores, showShowResultsButton, playerCapturedCards, showCapturedCards,
			isBombThrown, arnachist,
		} = this.state;

		if (activeScreen === 'place-bid') {
			return (
				<>
					<h1>Examine your hand and place a bid</h1>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						{this.renderOptions()}
						{playerHand.length ? (
							<Cards cards={playerHand} activeScreen={activeScreen} />
						) : (
							<p style={{ alignSelf: 'center' }} className="waiting-text">Waiting for
								{isDealer ? ' Other players to join...' : ' Dealer to deal cards...'}
							</p>
						)}
					</div>
				</>
			)
		} else if (activeScreen === 'play-trick') {
			return (
				<TrickImages
					name={name}
					cards={playerHand}
					setRoute={setRoute}
					activeScreen={activeScreen}
					setPlayerHand={setPlayerHand}
					stompClient={stompClient}
					allBidsPlaced={allBidsPlaced}
					revealedCards={revealedCards}
					revealingCards={revealingCards}
					canPlayTrick={canPlayTrick}
					selectedBid={selectedBid}
					undealtCard={undealtCard}
					registeredPlayers={registeredPlayers}
					playedTrick={playedTrick}
					capturedCards={capturedCards}
					trickCount={trickCount}
					handleSetGameState={this.handleSetGameState}
					setUndealtCard={setUndealtCard}
					showShowResultsButton={showShowResultsButton}
					isDealer={isDealer}
					playerCapturedCards={playerCapturedCards}
					toggleShowCapturedCards={this.toggleShowCapturedCards}
					showCapturedCards={showCapturedCards}
					isBombThrown={isBombThrown}
					arnachist={arnachist}
					game={game}
				/>
			)
		} else {
			return (
				<Result
					scores={scores}
					capturedCards={capturedCards}
					playAgain={this.playAgain}
					isDealer={isDealer}
					endGame={this.endGame}
					handleSetGameState={this.handleSetGameState}
				/>
			)
		}
	}
}