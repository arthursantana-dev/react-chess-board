import { useEffect, useState } from 'react';
import './App.css';

function App() {
	const [board, setBoard] = useState(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 2)))

	const boardPieces = ['none', 'wPawn', 'wKnight', 'wBishop', 'wRook', 'wQueen', 'wKing', 'bPawn', 'bKnight', 'bBishop', 'bRook', 'bQueen', 'bKing']


	const updateBoardCell = (row, column, newValue) => {
		setBoard(prevBoard => {
			const newMatrix = prevBoard.map((currentRow, rowIndex) =>
				rowIndex === row
					? currentRow.map((value, columnIndex) => (columnIndex === column ? newValue : value))
					: currentRow
			);

			return newMatrix;
		});
	};

	const handleCellSelection = (i, j) => {
		const pieceIndex = board[i][j]
		const oldCellValue = board[i][j]
		updateBoardCell(i, j, oldCellValue + 1)
	}

	

	return (
		<div className="App">
			<div className='board'>
				{
					board.map((r, i) => {
						return r.map((s, j) => {
							return <div className='board-square' onClick={() => handleCellSelection(i, j)}
								key={i * 8 + j}
								column={j}
								row={i}>
								{/* {boardPieces[board[i][j]]}
								{require(`./assets/pieces/${boardPieces[board[i][j]]}.png`)} */}
							</div>
						})
					})
				}
			</div>
		</div>
	);
}

export default App;
