import React from 'react';
import "./App.css"

const images = require.context('../public/cards/', true);
console.log(images)

export default function Cards({ cardId }) {

	return (
		<div className="card-container">
			<img
				src={images(`./${cardId}.png`)}
				alt=''
				className="card"
			/>
		</div>
	)
}