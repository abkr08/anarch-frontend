import { useState } from 'react'
import React, { Component } from 'react';
// import './App.css';
import Cards from './Cards'; 
import Button from './Button';
// import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const emptycards = ['6H', '6C', '7D', '9C', '10H'];

export default class Game extends Component {
	state = {
		selectedCard: ''
	}
	playTrick = (e) => {
		const { selectedCard } = this.state;
		alert(selectedCard)
	}
    handleClick= (event) => {
        // Do something when the image is clicked
        console.log('Image clicked!');
        console.log('Event:', event);
      }
	render() {
    const cards = ['6H', '6C', '7D', '9C', '10H', '9S', '4S', '9H', 'JC', 'AD'];
		return (
			<>
                <Cards cardId={cards} />
                <div style={{ display: 'flex', flexFlow: 'column'}}>
                <Button
                label = "Play Trick"
                />
                </div>
			</>
		)
	}
}