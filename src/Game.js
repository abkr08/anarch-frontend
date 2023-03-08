import { useState } from 'react'
import React, { Component } from 'react';

import './App.css';

import Cards from './Cards';

import './App.css';

const cards = ['6H', '6C', '7D', '9C', '10H', '9S', '4S', '9H', 'JC', 'AD'];

const bids = ['Spade', 'Club', 'Diamond', 'Heart', 'No suit', 'Misére'];

export default class Game extends Component {

	state = {
		selectedBid: ''
	}

	placeBid = () => {
		const { selectedBid } = this.state;
		alert(selectedBid)
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
		return (
			<>
				<h1>Examine your hand and place a bid</h1>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					{this.renderOptions()}
					<div className="card-grid">
						{cards.map(c => (
							<Cards cardId={c} />
						))}
					</div>
				</div>
			</>
		)
	}
}