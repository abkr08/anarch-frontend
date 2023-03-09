import { useState } from 'react'
import React, { Component } from 'react';

import './App.css';

import Cards from './Cards';
import TrickImages from './TrickImages';

const cards = ['6H', '6C', '7D', '9C', '10H', '9S', '4S', '9H', 'JC', 'AD'];

const bids = ['Spade', 'Club', 'Diamond', 'Heart', 'No suit', 'Misére'];

export default class Game extends Component {

	state = {
		selectedBid: '',
		hand: [],
		activeScreen: 'place-bid'
	}

	componentDidMount() {
		// Subscribe to the room the user will be playing in (/play for now)
		this.props.stompClient.subscribe(`/socket-publisher/play`, notification => {
			this.handleRoomNotifications(notification);
		});	
	}

	handleRoomNotifications = (data) => {
		let notification = JSON.parse(data.body);
    switch (notification.type) {
      case 'player-hand':
				this.setState({ hand: notification.hand })
        break;
      default:
        console.log(data)
    }
	}

	placeBid = () => {
		const { selectedBid } = this.state;
		const bidObject = { type: 'place bid', player: this.props.name, bid: selectedBid };
		this.props.stompClient.send('/socket-subscriber/play', {}, JSON.stringify(bidObject))
		setTimeout(() => {
			this.setState({ activeScreen: 'play-trick'});
		}, 5000);
	}

	renderOptions = () => {
		const { selectedBid } = this.state; 
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
			<button
			className="bid-button"
			onClick={this.placeBid}
			>
				Place Bid
			</button>
		</div>
	)}
	render() {
		const { playerHand } = this.props;
		const { activeScreen } = this.state;

		if (activeScreen == 'place-bid') {
			return (
				<>
					<h1>Examine your hand and place a bid</h1>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						{this.renderOptions()}
						<div className="card-grid">
							{playerHand.map(c => (
								<Cards cardId={c} />
							))}
						</div>
					</div>
				</>
			)
		} else {
			return (
				<TrickImages name={name} setRoute={setRoute} />
			)
		}
	}
}