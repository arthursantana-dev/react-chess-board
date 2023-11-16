import { useEffect, useState } from 'react';
import './App.css';

import none from './assets/pieces/none.png'
import wPawn from './assets/pieces/wPawn.png'
import wKnight from './assets/pieces/wKnight.png'
import wBishop from './assets/pieces/wBishop.png'
import wRook from './assets/pieces/wRook.png'
import wQueen from './assets/pieces/wQueen.png'
import wKing from './assets/pieces/wKing.png'
import bPawn from './assets/pieces/bPawn.png'
import bKnight from './assets/pieces/bKnight.png'
import bBishop from './assets/pieces/bBishop.png'
import bRook from './assets/pieces/bRook.png'
import bQueen from './assets/pieces/bQueen.png'
import bKing from './assets/pieces/bKing.png'


function App() {
	const [board, setBoard] = useState(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0)))

	const [boardSelectedSquares, setBoardSelectedSquares] = useState(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => false)))

	const boardPieces = [none, wPawn, wKnight, wBishop, wRook, wQueen, wKing, bPawn, bKnight, bBishop, bRook, bQueen, bKing]
	//                     0     1       2       3        4       5       6      7     8        9        10     11      12
	const boardPiecesNotation = ['', '', 'N', 'B', 'R', 'Q', 'K', '', 'N', 'B', 'R', 'Q', 'K']

	const [selectedPieceCoordinates, setSelectedPieceCoordinates] = useState(0) 
	//                                                                 x (row), y (column)

	const [turn, setTurn] = useState(true) //true - white; false - black

	const [gameNotation, setGameNotation] = useState([])


	useEffect(() => {
		updateBoardSquare(3, 4, 6, board, setBoard)
		updateBoardSquare(1, 3, 5, board, setBoard)
		updateBoardSquare(1, 7, 8, board, setBoard)
	}, [])

	const updateBoardSquare = (row, column, newValue, boardArray, setBoardArray) => {
		// if(boardArray == boardSelectedSquares){
		// 	if (board[row][column] != 0) return
		// }

		setBoardArray(boardArray => {
			const newMatrix = boardArray.map((currentRow, rowIndex) =>
				rowIndex === row
					? currentRow.map((value, columnIndex) => (columnIndex === column ? newValue : value))
					: currentRow
			);

			return newMatrix;
		});
	};

	const clearBoardSelection = () => {
		setBoardSelectedSquares(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => false)))
	}

	const updatePiecePosition = (pieceValue, prevRow, precColumn, newRow, newColumn) => {
		updateBoardSquare(prevRow, precColumn, 0, board, setBoard)
		updateBoardSquare(newRow, newColumn, pieceValue, board, setBoard)
	}

	const handleSquareSelection = (i, j) => {
		// i -> row
		// j -> column

		console.log('hss');

		const boardSquareValue = board[i][j]
		const isPieceSelected = boardPieces.indexOf(boardPieces[boardSquareValue]) > 0

		// console.log(`${i} - ${j} -> ${boardPieces.indexOf(boardPieces[boardSquareValue])}`);


		if(selectedPieceCoordinates != 0){
			if (!boardSelectedSquares[i][j]) {
				clearBoardSelection()
				return
			}

			if(selectedPieceCoordinates[0] == i && selectedPieceCoordinates[1] == j) return

			setTurn(!turn)
			// if(selectedPieceCoordinates == [i, j]) return
			updatePiecePosition(board[selectedPieceCoordinates[0]][selectedPieceCoordinates[1]], selectedPieceCoordinates[0], selectedPieceCoordinates[1], i, j)

			const pieceValue = boardPieces.indexOf(boardPieces[board[selectedPieceCoordinates[0]][selectedPieceCoordinates[1]]])

			setGameNotation([...gameNotation, `${boardPiecesNotation[pieceValue]}${String.fromCharCode(65 + j).toLowerCase()}${8 - i}`])

			setSelectedPieceCoordinates(0)
			clearBoardSelection()
			
			return
		} else {
			

			if (isPieceSelected) {

				const pieceValue = boardPieces.indexOf(boardPieces[boardSquareValue])
				if (([1,2,3,4,5,6].includes(pieceValue) && !turn) || ([7,8,9,10,11,12].includes(pieceValue) && turn)) return

				setSelectedPieceCoordinates([i, j])
			}
		}

		// if(selectedPieceCoordinates[0] != i || selectedPieceCoordinates[1] != j){
		// 	updatePiecePosition(boardPieces[board[selectedPieceCoordinates[0]][selectedPieceCoordinates[1]]], selectedPieceCoordinates[0], selectedPieceCoordinates[1], i, j)
		// }


		clearBoardSelection()

		const pieceValue = boardPieces[board[i][j]]

		// updateBoardSquare(i, j, prevSquareValue + 1, board, setBoard)
		updateBoardSquare(i, j, true, boardSelectedSquares, setBoardSelectedSquares)

		//rook
		// // recursiveSelection(i, j, 'down')
		

		switch (pieceValue) {
			case wPawn:
				recursiveSelection(i, j, 'up', 1)
				break;

			case wKnight:
			case bKnight:
				recursiveSelection(i, j, 'up', 2)
				break

			case wBishop:
			case bBishop:
				recursiveSelection(i, j, 'downLeft')
				recursiveSelection(i, j, 'upRight')
				recursiveSelection(i, j, 'downRight')
				recursiveSelection(i, j, 'upLeft')
				break

			case wRook:
			case bRook:
				recursiveSelection(i, j, 'left')
				recursiveSelection(i, j, 'right')
				recursiveSelection(i, j, 'up')
				recursiveSelection(i, j, 'down')
				break
			
			case wQueen:
			case bQueen:
				recursiveSelection(i, j, 'left')
				recursiveSelection(i, j, 'right')
				recursiveSelection(i, j, 'up')
				recursiveSelection(i, j, 'down')
				recursiveSelection(i, j, 'downLeft')
				recursiveSelection(i, j, 'upRight')
				recursiveSelection(i, j, 'downRight')
				recursiveSelection(i, j, 'upLeft')
				break

			case wKing:
			case bKing:
				recursiveSelection(i, j, 'up', 6)
				break

			default:
				break;
		}

	}

	const recursiveSelection = (i, j, direction, span = 0) => {
		// if(board[i][j]){
		// 	if(boardPieces[i][j] != 0) return
		// }else return

		if (span == 1) {
			updateBoardSquare(i-1, j, true, boardSelectedSquares, setBoardSelectedSquares)

			//capture
			// updateBoardSquare(i-1, j-1, true, boardSelectedSquares, setBoardSelectedSquares)
			// updateBoardSquare(i-1, j+1, true, boardSelectedSquares, setBoardSelectedSquares)
			return
		} else if (span == 2) {
			updateBoardSquare(i-2, j+1, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i-2, j-1, true, boardSelectedSquares, setBoardSelectedSquares)
			
			updateBoardSquare(i-1, j+2, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i-1, j-2, true, boardSelectedSquares, setBoardSelectedSquares)

			updateBoardSquare(i+2, j+1, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i+2, j-1, true, boardSelectedSquares, setBoardSelectedSquares)
			
			updateBoardSquare(i+ 1, j+2, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i+ 1, j-2, true, boardSelectedSquares, setBoardSelectedSquares)
			return
		} else if (span == 6){
			updateBoardSquare(i-1, j-1, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i-1, j, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i-1, j+1, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i, j-1, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i, j+1, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i+1, j-1, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i+1, j, true, boardSelectedSquares, setBoardSelectedSquares)
			updateBoardSquare(i+1, j+1, true, boardSelectedSquares, setBoardSelectedSquares)
			return
		}

		const rightLimit = j == 8
		const leftLimit = j == -1
		const upLimit = i == -1
		const downLimit = i == 8

		switch (direction) {
			case 'right':
				if(rightLimit) return
				break
			case 'left':
				if(leftLimit) return
				break

			case 'up':
				if(upLimit) return
				break

			case 'down':
				if(downLimit) return
				break

			case 'upRight':
				if (upLimit || rightLimit) return
				break

			case 'upLeft':
				if (upLimit || leftLimit) return
				break

			case 'downRight':
				if (downLimit || rightLimit) return
				break

			case 'downLeft':
				if (downLimit || leftLimit) return
			break
		}

		updateBoardSquare(i, j, true, boardSelectedSquares, setBoardSelectedSquares)
		
		if (span != 0 && board[i][j] != 0) return

		switch (direction) {
			case 'right':
				
					recursiveSelection(i, j+1, 'right', -1)
				break
		
				case 'left':
					
					recursiveSelection(i, j-1, 'left', -1)
				break

				case 'up':
					
					recursiveSelection(i - 1, j, 'up', -1)
					break
				
				case 'down':
					recursiveSelection(i + 1, j, 'down', -1)
					break

				case 'upRight':
					recursiveSelection(i-1, j+1, 'upRight', -1)
					break

				case 'upLeft':
					recursiveSelection(i - 1, j - 1, 'upLeft', -1)
					break

				case 'downRight':
					recursiveSelection(i + 1, j - 1, 'downRight', -1)
					break

				case 'downLeft':
					recursiveSelection(i + 1, j + 1, 'downLeft', -1)
					break
		}
		
	}


	return (
		<div className="App">
			<div className="board-container">
				<div className="board-column">
					<p>8</p>
					<p>7</p>
					<p>6</p>
					<p>5</p>
					<p>4</p>
					<p>3</p>
					<p>2</p>
					<p>1</p>
				</div>
				<div className="col">
					<div className='board'>
						{
							board.map((r, i) => {
								return r.map((s, j) => {
									return <div className={`board-square ${boardSelectedSquares[i][j]? 'board-square--selected' : ''}`}onClick={() => handleSquareSelection(i, j)}
										key={i * 8 + j}
										column={j}
										row={i}>
											<img src={boardPieces[board[i][j]]} className='img-piece'/>
									</div>
								})
							})
						}
					</div>
					<div className='board-row'>
						<p>
							a
						</p>
						<p>
							b
						</p>
						<p>
							c
						</p>
						<p>
							d
						</p>
						<p>
							e
						</p>
						<p>
							f
						</p>
						<p>
							g
						</p>
						<p>
							h
						</p>
					</div>
				</div>
			</div>
			<div className='game-notation-container'>
				{
					gameNotation.map((r, i) => <>
					{
						(i + 1)%2 != 0? <span>{(i + 2)/2}. </span> : ''
					}
					<span style={{marginRight: 7}} key={i}>{r}</span>
					{
						(i + 1)%2 == 0? <br/> : ''
					}
					</>) 
				}
			</div>
		</div>
	);
}

export default App;
