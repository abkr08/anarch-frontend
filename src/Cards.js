import React, { useState } from 'react';
import SharedDeck from './SharedDeck';
import "./App.css"

const images = require.context('../public/cards/', true);
console.log(images)
export default function Cards({ cardId }) {
const [valueToPass, setValueToPass] = useState(null);
	  const handleClick = (event) => {
		const value = event.target.id; // the value you want to pass to SharedDeck component
		setValueToPass(value);
	  }
	  if (valueToPass !== null) {
		return <SharedDeck cardSelected={valueToPass} />;
	  }
	return (
		<>
		<SharedDeck cardSelected = {valueToPass}/>
		<div className="row align-items-start">
		{cardId.map(c=>{
			 return <div className="col">
				<img
					src={images(`./${c}.png`)}
					alt=''
					id={c}
					className="card"
					onClick={handleClick}
				/>
		 </div>
		})}
		</div>
		</>
	)
}