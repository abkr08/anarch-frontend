import React from 'react';

const mockData = { "capturedCards": { "CPU4": [{ "suit": "H", "player": 4, "trickPlayed": "6" }], "CPU3": [{ "suit": "S", "player": 3, "trickPlayed": "Q" }], "CPU2": [], "Sam": [{ "suit": "D", "player": 1, "trickPlayed": "Q" }, { "suit": "D", "player": 2, "trickPlayed": "4" }], "Sannn": [{ "suit": "C", "player": 5, "trickPlayed": "Q" }, { "suit": "C", "player": 6, "trickPlayed": "2" }] }, "scores": { "CPU4": 0, "CPU3": 0, "CPU2": 0, "Sam": 4, "Sannn": 4 }, "type": "end-of-round" };
const sortedScores = Object.keys(mockData.scores).map(player => ({
	name: player, score: mockData.scores[player]
})).sort((a, b) => b.score - a.score);
export default function Result({ scores, capturedCards, playAgain, isDealer, endGame, handleSetGameState }) {
	return (
		<div className="result">
			<h1>Result</h1>
			<table>
				<thead>
					<tr>
						<th>Position</th>
						<th>Name</th>
						<th>Bid</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{scores.map((data, i) => (
						<tr>
							<td style={i === 0 ? { color: 'green', fontWeight: 'bold' } : {}}>
								{i === 0 ? 'Winner' : i + 1}
							</td>
							<td>{data.name}</td>
							<td>{data.bid}</td>
							<td>{data.score}</td>
						</tr>
					))}
				</tbody>
			</table>
			<div>
			{isDealer && (
				<button
					className="bid-button"
					onClick={playAgain}
				>
					Play Again?
				</button>
				)}
				<button
					className="back-button"
					onClick={() => handleSetGameState({ activeScreen: 'play-trick'})}
				>
					Back to tricks
				</button>
				<button
					className="bid-button"
					onClick={endGame}
				>
					End Game
				</button>
				</div>

		</div>
	)
}
