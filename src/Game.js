import React, { Component } from 'react';

import './App.css';

import Cards from './Cards';
import TrickImages from './TrickImages';

const cardss = ['6H', '6C', '7D', '9C', '10H', '9S', '4S', '9H', 'JC', 'AD'];

const bids = ['Spade', 'Club', 'Diamond', 'Heart', 'No suit', 'Misére'];

export default class Game extends Component {

	state = {
		selectedBid: '',
		hand: [],
		activeScreen: 
		// 'play-trick'
		'place-bid',
		placingBid: false,
		allBidsPlaced: false,
		revealedCards: {},
		revealingCards: false,
		canPlayTrick: true,
		playedTrick: {},
		capturedCards: {},
		trickCount: 1,
	}

	componentDidMount() {
		// Subscribe to the room the user will be playing in (/play for now)
		this.props.stompClient?.subscribe(`/socket-publisher/play`, notification => {
			this.handleRoomNotifications(notification);
		});	
	}

	componentDidUpdate() {
		const { isBidPlaced } = this.props;
		const { activeScreen } = this.state;

		if (activeScreen !== 'play-trick' && isBidPlaced) {
			this.setState({ activeScreen: 'play-trick'});
		}

	}

	handleSetGameState = newState => this.setState(newState);

	addDelay = (callBack, delay) => {
		setTimeout(callBack, delay);
	}

	handleRoomNotifications = (data) => {
		const { setUndealtCard } = this.props;
		let notification = JSON.parse(data.body);
    switch (notification.type) {
			case 'all-bids-placed':
				this.setState({ allBidsPlaced: true });
				break;
			case 'reveal-cards':
				this.addDelay(this.setState({ revealedCards: notification.playedTricks, revealingCards: true, playedTrick: {} }), 5000)
				break;
			case 'played-trick':
				this.setState(prevState => ({ playedTrick: { ...prevState.playedTrick, [notification.player]: true }}));
				break;
			case 'capture-cards':
				this.setState({ capturedCards: notification.capturedCards })
				// this.addDelay(this.setState({ canPlayTrick: true }), 5000);
				break;
			case 'next-round':
				this.setState({
					trickCount: notification.trickCount, canPlayTrick: true, revealedCards: {},
					revealingCards: false, capturedCards: {},
				});
				setUndealtCard(notification.undealtCard);
				break;
			case "end-of-round":
				this.setState({ scores: notification.scores, roundCapturedCards: notification.capturedCards });
				alert(notification.scores);
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

	renderOptions = () => {
		const { selectedBid, placingBid } = this.state; 
		return (
		<div style={{ display: 'flex', flexFlow: 'column'}}>
			<div className="list-container">
				{bids.map(bid => (
					<li 
					onClick={() => this.setState({ selectedBid: bid })}
					id={ selectedBid === bid ? 'selectedBid' : ''}
					>
						{bid}
					</li>
				))}
			</div>
			{ placingBid && <p className="waiting-text">Placing Bid...</p>}
			<button
			className="bid-button"
			onClick={this.placeBid}
			disabled={placingBid}
			>
				Place Bid
			</button>
		</div>
	)}
	render() {
		const { playerHand, name, setRoute, setPlayerHand,
			stompClient, undealtCard, registeredPlayers,
		} = this.props;
		const { activeScreen, allBidsPlaced, revealedCards,
			canPlayTrick, selectedBid, revealingCards, playedTrick, capturedCards, trickCount
		} = this.state;

		if (activeScreen === 'place-bid') {
			return (
				<>
					<h1>Examine your hand and place a bid</h1>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						{this.renderOptions()}
							{/* {playerHand.map(c => ( */}
								<Cards cards={playerHand} activeScreen={activeScreen}/>
							{/* ))} */}
						</div>
				</>
			)
		} else {
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
				/>
			)
		}
	}
}