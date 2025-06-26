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

// Função principal
function App() {
	const [board, setBoard] = useState(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0)))

	const [boardSelectedSquares, setBoardSelectedSquares] = useState(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => false)))

	const boardPieces = [none, wPawn, wKnight, wBishop, wRook, wQueen, wKing, bPawn, bKnight, bBishop, bRook, bQueen, bKing]
	//                     0     1       2       3        4       5       6      7     8        9        10     11      12
	const boardPiecesNotation = ['', '', 'N', 'B', 'R', 'Q', 'K', '', 'N', 'B', 'R', 'Q', 'K']

	const [selectedPieceCoordinates, setSelectedPieceCoordinates] = useState(0)
	//                                                                 x (row), y (column)


	const [moveIndex, setMoveIndex] = useState(0)

	const [boardCheck, setBoardCheck] = useState([-1, -1])

	const [turn, setTurn] = useState(true) //true - white; false - black

	const [move, setMove] = useState([[], []])

	const [game, setGame] = useState([[[10, 8, 9, 11, 12, 9, 8, 10],
	[7, 7, 7, 7, 7, 7, 7, 7],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1],
	[4, 2, 3, 5, 6, 3, 2, 4]]])

	const [gameImage, setGameImage] = useState([[
		[10, 8, 9, 11, 12, 9, 8, 10],
		[7, 7, 7, 7, 7, 7, 7, 7],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1],
		[4, 2, 3, 5, 6, 3, 2, 4]]
	])

	const [gameNotation, setGameNotation] = useState([]) //1 == vitória brancas; 0 == vitória pretas; 0.5 == empate

	let moveState;

	let boardState;

	useEffect(() => {
		console.log(gameNotation)
		// isKingInCheck(0, board)
		// isKingInCheck(1, board)
		console.log(gameImage[moveIndex]);

		console.log("-------------------");



	}, [gameNotation])


	function gameEnd(result) {
		boardStartingPosition(result);
	}

	const [pawnPreviousColumn, setPawnPreviousColumn] = useState(0)

	const isPieceWhite = (i, j) => { //1 - white; 0 - black

		// if(!between(i, 0, 7) || !between(j, 0, 7)) return
		if (!board[i][j]) return

		const pieceValue = board[i][j]

		if (pieceValue == 0) return -1

		if (pieceValue <= 6) return 1

		return 0
	}

	function copyGameToClipboard() {
		let gamePGN = ''

		gameNotation.map((e, i) => {
			if (i == 0) {
				gamePGN += `1. ${e} `
				return
			}
			if ((i + 1) % 2 == 0) {
				gamePGN += `${e} \n`
				return
			}
			gamePGN += `${i / 2 + 1}. ${e} `
		})

		navigator.clipboard.writeText(gamePGN)
	}

	// Starting position
	function boardStartingPosition(lastMove = "") {
		// 1. Crie uma nova matriz vazia para o tabuleiro
		let newBoard = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0));

		if (lastMove) {
			// console.log("fim de jogo");
			let oldNotation = gameNotation;
			oldNotation.push(lastMove)

			console.log("_______________________");

			console.log(JSON.stringify(oldNotation));
			console.log(JSON.stringify(game));
			console.log(JSON.stringify(gameImage));

			console.log("_______________________");


			setGameNotation(oldNotation)

		}


		setTurn(true);
		setGameNotation([]);
		setGame([])
		setBoardCheck([-1, -1])
		setMoveIndex(0)

		// 2. Modifique esta nova matriz diretamente
		// Black pieces
		newBoard[0][0] = 10; // bRook
		newBoard[0][1] = 8;  // bKnight
		newBoard[0][2] = 9;  // bBishop
		newBoard[0][3] = 11; // bQueen
		newBoard[0][4] = 12; // bKing
		newBoard[0][5] = 9;  // bBishop
		newBoard[0][6] = 8;  // bKnight
		newBoard[0][7] = 10; // bRook

		// Black pawns
		for (let j = 0; j < 8; j++) {
			newBoard[1][j] = 7; // bPawn
		}

		// White pawns
		for (let j = 0; j < 8; j++) {
			newBoard[6][j] = 1; // wPawn
		}

		// White pieces
		newBoard[7][0] = 4;  // wRook
		newBoard[7][1] = 2;  // wKnight
		newBoard[7][2] = 3;  // wBishop
		newBoard[7][3] = 5;  // wQueen
		newBoard[7][4] = 6;  // wKing
		newBoard[7][5] = 3;  // wBishop
		newBoard[7][6] = 2;  // wKnight
		newBoard[7][7] = 4;  // wRook

		setBoard(newBoard);

		clearBoardSelection();
	}

	function goForwardGameMove() {

		console.log("********");

		if(game[moveIndex][0][0] == game[moveIndex][1][0] &&  game[moveIndex][0][1] == game[moveIndex][1][1]) return

		// console.log(`${game[moveIndex][0][0]} ${game[moveIndex][0][1]}; ${game[moveIndex][1][0]} ${game[moveIndex][1][1]}`);

		console.log(moveIndex);
		console.log(gameImage);
		console.log(game);

		if (moveIndex < game.length && game.length > 0) {

			const pieceValue = gameImage[moveIndex][game[moveIndex][0][0]][[game[moveIndex][0][1]]]

			const start = [game[moveIndex][0][0], game[moveIndex][0][1]]
			const end = [game[moveIndex][1][0], game[moveIndex][1][1]]

			// setTurn(!turn)

			// console.log();

			console.log(moveIndex);
			console.log(game);
			console.log(game[moveIndex]);

			setMoveIndex(moveIndex + 1)

			// setBoard(gameImage[moveIndex])

			updatePiecePosition(pieceValue, start[0], start[1], end[0], end[1])

		}

	}

	useEffect(() => {
		console.log(`TURN: ${turn}`);

	}, [turn])

	function goBackGameMove() {
		// console.log(game);

		if (gameImage.length > 0) {
			setBoard(gameImage[moveIndex])

			console.log(`mi: ${moveIndex}`);


			if (moveIndex > 0) {
				setMoveIndex(moveIndex - 1)
			}
		}

	}

	useEffect(() => {

		(async () => {
			fetch("http://localhost:3003/")
				.then(res => res.json())
				.then(res => console.log(res)
				)
		})()

		boardStartingPosition()

		/*

		["g4 ","f5 ","½-½"]

		[[[6,6],[4,6]],[[1,5],[3,5]],[[0.5,0],[0.5,0]]]

		[[[10,8,9,11,12,9,8,10],[7,7,7,7,7,7,7,7],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1],[4,2,3,5,6,3,2,4]],[[10,8,9,11,12,9,8,10],[7,7,7,7,7,7,7,7],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1],[4,2,3,5,6,3,2,4]],[[10,8,9,11,12,9,8,10],[7,7,7,7,7,7,7,7],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0],[1,1,1,1,1,1,0,1],[4,2,3,5,6,3,2,4]]]
	
		*/

		setGameNotation(["g4 ","f5 ","½-½"])
		setGame([[[6,6],[4,6]],[[1,5],[3,5]],[[0.5,0],[0.5,0]]])
		setGameImage([[[10,8,9,11,12,9,8,10],[7,7,7,7,7,7,7,7],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1],[4,2,3,5,6,3,2,4]],[[10,8,9,11,12,9,8,10],[7,7,7,7,7,7,7,7],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[1,1,1,1,1,1,1,1],[4,2,3,5,6,3,2,4]],[[10,8,9,11,12,9,8,10],[7,7,7,7,7,7,7,7],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],[0,0,0,0,0,0,1,0],[0,0,0,0,0,0,0,0],[1,1,1,1,1,1,0,1],[4,2,3,5,6,3,2,4]]])


	}, [])

	function updateBoardSquare(row, column, newValue, boardArray, setBoardArray, isPreviousPiece = false) {

		const rightLimit = column >= 8
		const leftLimit = column <= -1
		const upLimit = row <= -1
		const downLimit = row >= 8

		if (rightLimit || leftLimit || upLimit || downLimit) return

		if (!isPreviousPiece) {
			if ((turn && isPieceWhite(row, column) == 1) || (!turn && isPieceWhite(row, column) == 0)) return
		}


		setBoardArray(boardArray => {
			const newMatrix = boardArray.map((currentRow, rowIndex) =>
				rowIndex === row
					? currentRow.map((value, columnIndex) => (columnIndex === column ? newValue : value))
					: currentRow
			);

			return newMatrix;
		});
	};

	function clearBoardSelection() {
		setBoardSelectedSquares(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => false)))
	}

	function clearBoard() {
		board.forEach((r, i) => {
			r.forEach((c, j) => {
				updateBoardSquare(i, j, 0, board, setBoard)
			})
		})
	}

	function updatePiecePosition(pieceValue, prevRow, precColumn, newRow, newColumn) {

		updateBoardSquare(prevRow, precColumn, 0, board, setBoard, true)
		updateBoardSquare(newRow, newColumn, pieceValue, board, setBoard)

		boardState = board
	}

	function cancelSelection() {
		setSelectedPieceCoordinates(0)
		clearBoardSelection()
	}

	function between(x, a, b) {
		return x >= a && x <= b
	}

	function noteMove(i, j, pieceValue, isCapture = false, isPawnCapture = false) {
		const moveStartCoodinates = move[0]

		// boardState = board

		moveState = [moveStartCoodinates, [i, j]]

		setMove([moveStartCoodinates, [i, j]])

		setMoveIndex(moveIndex + 1)

		if (moveState[1].toString() !== [-1, -1].toString()) {

			console.log(`início: ${moveState[0][0]}, ${moveState[0][1]}`);
			console.log(`fim: ${moveState[1][0]}, ${moveState[1][1]}`);

			const oldGameImage = gameImage

			oldGameImage.push(boardState)

			setGameImage(oldGameImage)

			console.log(gameImage);

			setGame(prevGame => {
				const newGame = [...prevGame];
				newGame.push(moveState);

				if (newGame.length > 0 && newGame[0][1] && newGame[0][1].length === 0) {
					newGame.shift();
				}
				return newGame;
			});
		}



		if (!isCapture) {
			setGameNotation([...gameNotation, `${boardPiecesNotation[pieceValue]}${String.fromCharCode(65 + j).toLowerCase()}${8 - i} `])
			return
		}

		if (!isPawnCapture) {
			setGameNotation([...gameNotation, `${boardPiecesNotation[pieceValue]}x${String.fromCharCode(65 + j).toLowerCase()}${8 - i} `])
			return
		}

		console.log("pawnPreviousColumn " + pawnPreviousColumn);
		setGameNotation([...gameNotation, `${String.fromCharCode(65 + pawnPreviousColumn).toLowerCase()}x${String.fromCharCode(65 + j).toLowerCase()}${8 - i} `])
	}

	function isSquareAttacked(targetRow, targetColumn, attackingColor, currentBoard) {
		// attackingColor: 1 para branco atacando, 0 para preto atacando

		// A cor do rei que estamos verificando o cheque
		const kingColor = attackingColor === 1 ? 0 : 1; // Se as brancas estão atacando, o rei é preto e vice-versa

		// 1. Verificar Peões
		if (attackingColor === 1) { // Peões brancos atacando
			if (between(targetRow + 1, 0, 7) && (
				(between(targetColumn - 1, 0, 7) && currentBoard[targetRow + 1][targetColumn - 1] === 1) ||
				(between(targetColumn + 1, 0, 7) && currentBoard[targetRow + 1][targetColumn + 1] === 1)
			)) {
				return true;
			}
		} else { // Peões pretos atacando
			if (between(targetRow - 1, 0, 7) && (
				(between(targetColumn - 1, 0, 7) && currentBoard[targetRow - 1][targetColumn - 1] === 7) ||
				(between(targetColumn + 1, 0, 7) && currentBoard[targetRow - 1][targetColumn + 1] === 7)
			)) {
				return true;
			}
		}

		// 2. Verificar Cavalos (mesmos movimentos para ambos os lados)
		const knightMoves = [
			[-2, 1], [-2, -1], [-1, 2], [-1, -2],
			[2, 1], [2, -1], [1, 2], [1, -2]
		];
		for (const [dr, dc] of knightMoves) {
			const r = targetRow + dr;
			const c = targetColumn + dc;
			if (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if ((attackingColor === 1 && piece === 2) || (attackingColor === 0 && piece === 8)) {
					return true;
				}
			}
		}

		// 3. Verificar Bispos e Rainhas (diagonais)
		const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
		for (const [dr, dc] of diagonalDirections) {
			let r = targetRow + dr;
			let c = targetColumn + dc;
			while (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if (piece !== 0) {
					if ((attackingColor === 1 && (piece === 3 || piece === 5)) ||
						(attackingColor === 0 && (piece === 9 || piece === 11))) {
						return true;
					}
					break; // Parar se encontrar uma peça (sua ou do oponente)
				}
				r += dr;
				c += dc;
			}
		}

		// 4. Verificar Torres e Rainhas (linhas e colunas)
		const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
		for (const [dr, dc] of straightDirections) {
			let r = targetRow + dr;
			let c = targetColumn + dc;
			while (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if (piece !== 0) {
					if ((attackingColor === 1 && (piece === 4 || piece === 5)) ||
						(attackingColor === 0 && (piece === 10 || piece === 11))) {
						return true;
					}
					break; // Parar se encontrar uma peça (sua ou do oponente)
				}
				r += dr;
				c += dc;
			}
		}

		// 5. Verificar Reis (para cheque "adjacente" - importante para evitar movimentos ilegais)
		const kingMoves = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 1],
			[1, -1], [1, 0], [1, 1]
		];
		for (const [dr, dc] of kingMoves) {
			const r = targetRow + dr;
			const c = targetColumn + dc;
			if (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if ((attackingColor === 1 && piece === 6) || (attackingColor === 0 && piece === 12)) {
					return true;
				}
			}
		}

		return false; // A casa não está sendo atacada
	}

	function isKingInCheck(kingColorBoolean, currentBoard) {
		// Converte o booleano kingColorBoolean para 1 (branco) ou 0 (preto)
		const kingColor = kingColorBoolean ? 1 : 0; // 1 para branco, 0 para preto

		let kingRow = -1;
		let kingColumn = -1;

		// Encontrar a posição do rei da cor especificada
		const kingPieceValue = kingColor === 1 ? 6 : 12; // 6 para rei branco (wKing), 12 para rei preto (bKing)
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (currentBoard[i][j] === kingPieceValue) {
					kingRow = i;
					kingColumn = j;
					break;
				}
			}
			if (kingRow !== -1) break;
		}

		// Se o rei não for encontrado (situação incomum, mas por segurança)
		if (kingRow === -1) {
			console.warn(`Rei da cor ${kingColor === 1 ? 'branca' : 'preta'} não encontrado no tabuleiro.`);
			return false;
		}

		// A cor que estaria atacando o rei
		const attackingColor = kingColor === 1 ? 0 : 1; // Se o rei é branco (1), as pretas (0) atacam. Se o rei é preto (0), as brancas (1) atacam.

		return isSquareAttacked(kingRow, kingColumn, attackingColor, board)
	}

	function getCheckingPieces(kingColor, currentBoard) {
		let kingRow = -1;
		let kingColumn = -1;
		const checkingPieces = [];

		// Encontrar a posição do rei
		const kingPieceValue = kingColor === 1 ? 6 : 12; // 6 para rei branco, 12 para rei preto
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				if (currentBoard[i][j] === kingPieceValue) {
					kingRow = i;
					kingColumn = j;
					break;
				}
			}
			if (kingRow !== -1) break;
		}

		if (kingRow === -1) {
			// Rei não encontrado, o que é um estado de erro para o cheque
			return [];
		}

		const attackingColor = kingColor === 1 ? 0 : 1; // Cor do oponente

		// Lógica para encontrar peças que atacam o rei:

		// 1. Verificar Peões
		if (attackingColor === 1) { // Peões brancos atacando
			if (between(kingRow + 1, 0, 7)) {
				if (between(kingColumn - 1, 0, 7) && currentBoard[kingRow + 1][kingColumn - 1] === 1) checkingPieces.push([kingRow + 1, kingColumn - 1]);
				if (between(kingColumn + 1, 0, 7) && currentBoard[kingRow + 1][kingColumn + 1] === 1) checkingPieces.push([kingRow + 1, kingColumn + 1]);
			}
		} else { // Peões pretos atacando
			if (between(kingRow - 1, 0, 7)) {
				if (between(kingColumn - 1, 0, 7) && currentBoard[kingRow - 1][kingColumn - 1] === 7) checkingPieces.push([kingRow - 1, kingColumn - 1]);
				if (between(kingColumn + 1, 0, 7) && currentBoard[kingRow - 1][kingColumn + 1] === 7) checkingPieces.push([kingRow - 1, kingColumn + 1]);
			}
		}

		// 2. Verificar Cavalos
		const knightMoves = [
			[-2, 1], [-2, -1], [-1, 2], [-1, -2],
			[2, 1], [2, -1], [1, 2], [1, -2]
		];
		for (const [dr, dc] of knightMoves) {
			const r = kingRow + dr;
			const c = kingColumn + dc;
			if (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if ((attackingColor === 1 && piece === 2) || (attackingColor === 0 && piece === 8)) {
					checkingPieces.push([r, c]);
				}
			}
		}

		// 3. Verificar Bispos e Rainhas (diagonais)
		const diagonalDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
		for (const [dr, dc] of diagonalDirections) {
			let r = kingRow + dr;
			let c = kingColumn + dc;
			while (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if (piece !== 0) {
					if ((attackingColor === 1 && (piece === 3 || piece === 5)) ||
						(attackingColor === 0 && (piece === 9 || piece === 11))) {
						checkingPieces.push([r, c]);
					}
					break;
				}
				r += dr;
				c += dc;
			}
		}

		// 4. Verificar Torres e Rainhas (linhas e colunas)
		const straightDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
		for (const [dr, dc] of straightDirections) {
			let r = kingRow + dr;
			let c = kingColumn + dc;
			while (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if (piece !== 0) {
					if ((attackingColor === 1 && (piece === 4 || piece === 5)) ||
						(attackingColor === 0 && (piece === 10 || piece === 11))) {
						checkingPieces.push([r, c]);
					}
					break;
				}
				r += dr;
				c += dc;
			}
		}

		// 5. Verificar Reis (para cheque "adjacente") - apenas para detectar se o rei oposto
		// se moveu para uma casa ilegal (adjacente ao nosso rei)
		const kingMoves = [
			[-1, -1], [-1, 0], [-1, 1],
			[0, -1], [0, 1],
			[1, -1], [1, 0], [1, 1]
		];
		for (const [dr, dc] of kingMoves) {
			const r = kingRow + dr;
			const c = kingColumn + dc;
			if (between(r, 0, 7) && between(c, 0, 7)) {
				const piece = currentBoard[r][c];
				if ((attackingColor === 1 && piece === 6) || (attackingColor === 0 && piece === 12)) {
					checkingPieces.push([r, c]);
				}
			}
		}

		return checkingPieces;
	}

	function handleSquareSelection(i, j) {

		console.log("caiu");
		console.log(moveIndex);
		console.log(game.length);




		if (moveIndex != game.length) return

		// i -> row
		// j -> column
		const boardSquareValue = board[i][j]

		const isPieceSelected = boardPieces.indexOf(boardPieces[boardSquareValue]) > 0

		if (isPieceSelected) {
			setMove([[i, j], [-1, -1]])
		}

		if (boardSelectedSquares[i][j] == false && isPieceSelected == false) {
			cancelSelection()
			return
		}

		// peça selecionada
		if (selectedPieceCoordinates != 0) {

			const moveStartCoodinates = move[0]

			console.log(`msc: ${moveStartCoodinates}`);


			// setMove([moveStartCoodinates, [i,j]])


			if (selectedPieceCoordinates[0] == i && selectedPieceCoordinates[1] == j) return


			//turno das brancas e peça branca em i,j
			if ((turn && isPieceWhite(i, j) == 1) || (!turn && isPieceWhite(i, j) == 0) || !boardSelectedSquares[i][j]) {
				cancelSelection()
				return
			}

			setTurn(!turn)

			updatePiecePosition(board[selectedPieceCoordinates[0]][selectedPieceCoordinates[1]], selectedPieceCoordinates[0], selectedPieceCoordinates[1], i, j)


			const pieceValue = boardPieces.indexOf(boardPieces[board[selectedPieceCoordinates[0]][selectedPieceCoordinates[1]]])

			// console.log(`============: ${board[i][j]}`);

			console.log("pieceValue " + (pieceValue));
			if (pieceValue != 1 && pieceValue != 7) {
				console.log("pieceValue " + (pieceValue));
				if (board[i][j] == 0) {
					noteMove(i, j, pieceValue)
				} else {
					noteMove(i, j, pieceValue, true)
				}
			} else {
				if (board[i][j] == 0) {
					noteMove(i, j, pieceValue)
				} else {
					noteMove(i, j, pieceValue, true, true)
				}
			}




			setSelectedPieceCoordinates(0)
			clearBoardSelection()

			return
		} else {

			if (isPieceSelected) {

				if ((isPieceWhite(i, j) == 1 && !turn) || (isPieceWhite(i, j) == 0 && turn)) return

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

		console.log(`lance : ${turn ? "brancas" : "pretas"}`);


		if (1 == 0) {
			console.log(`rei em xeque! : ${turn}`);

		} else {
			if (pieceValue == wPawn) {

				if (i == 6) recursiveSelection(i, j, 'up', 4)

				// white piece capture
				if (between(i - 1, 0, 7) && between(j + 1, 0, 7)) {
					if (board[i - 1][j + 1] != 0 && isPieceWhite(i - 1, j + 1) == 0) {
						setPawnPreviousColumn(j)
						recursiveSelection(i, j, 'up', 10)
					}

				}

				if (between(i - 1, 0, 7) && between(j - 1, 0, 7)) {
					if (board[i - 1][j - 1] != 0 && isPieceWhite(i - 1, j - 1) == 0) {
						setPawnPreviousColumn(j)
						recursiveSelection(i, j, 'up', 11)

					}
				}



			} else if (pieceValue == bPawn) {

				if (i == 1) recursiveSelection(i, j, 'down', 5)

				// black piece capture
				if (between(i + 1, 0, 7) && between(j + 1, 0, 7)) {
					if (board[i + 1][j + 1] != 0 && isPieceWhite(i + 1, j + 1) == 1) {
						setPawnPreviousColumn(j)
						recursiveSelection(i, j, 'down', 20)
					}

				}

				if (between(i + 1, 0, 7) && between(j - 1, 0, 7)) {
					if (board[i + 1][j - 1] != 0 && isPieceWhite(i + 1, j - 1) == 1) {
						setPawnPreviousColumn(j)
						recursiveSelection(i, j, 'down', 21)

					}

				}
			}


			switch (pieceValue) {
				case wPawn:
					if (board[i - 1][j] == 0) recursiveSelection(i, j, 'up', 1)
					break;

				case bPawn:
					if (board[i + 1][j] == 0) recursiveSelection(i, j, 'down', 3)
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

					// console.log(`******************: ${i}, ${j}`);

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



		console.log("---------------------------------------------------");

	}

	function recursiveSelection(i, j, direction, span = 0) { //10 - wPawn captures || 20 - bPawn captures

		switch (span) {
			case 1:
				updateBoardSquare(i - 1, j, true, boardSelectedSquares, setBoardSelectedSquares)
				break

			case 2:

				updateBoardSquare(i - 2, j + 1, true, boardSelectedSquares, setBoardSelectedSquares)
				updateBoardSquare(i - 2, j - 1, true, boardSelectedSquares, setBoardSelectedSquares)

				updateBoardSquare(i - 1, j + 2, true, boardSelectedSquares, setBoardSelectedSquares)
				updateBoardSquare(i - 1, j - 2, true, boardSelectedSquares, setBoardSelectedSquares)

				updateBoardSquare(i + 2, j + 1, true, boardSelectedSquares, setBoardSelectedSquares)
				updateBoardSquare(i + 2, j - 1, true, boardSelectedSquares, setBoardSelectedSquares)

				updateBoardSquare(i + 1, j + 2, true, boardSelectedSquares, setBoardSelectedSquares)
				updateBoardSquare(i + 1, j - 2, true, boardSelectedSquares, setBoardSelectedSquares)
				break

			case 3:
				updateBoardSquare(i + 1, j, true, boardSelectedSquares, setBoardSelectedSquares)
				break

			case 4:
				if (board[i - 1][j] == 0) { updateBoardSquare(i - 1, j, true, boardSelectedSquares, setBoardSelectedSquares) } else break
				if (board[i - 2][j] == 0) { updateBoardSquare(i - 2, j, true, boardSelectedSquares, setBoardSelectedSquares) }
				break

			case 5:
				if (board[i + 1][j] == 0) { updateBoardSquare(i + 1, j, true, boardSelectedSquares, setBoardSelectedSquares) } else break
				if (board[i + 2][j] == 0) { updateBoardSquare(i + 2, j, true, boardSelectedSquares, setBoardSelectedSquares) }
				break

			case 6:
				const kingMoves = [
					[-1, -1], [-1, 0], [-1, 1],
					[0, -1], [0, 1],
					[1, -1], [1, 0], [1, 1]
				];

				const currentPieceColor = isPieceWhite(i, j); // Cor do rei que está sendo movido
				const attackingColor = currentPieceColor === 1 ? 0 : 1; // Cor do oponente

				for (const [dr, dc] of kingMoves) {
					const newRow = i + dr;
					const newColumn = j + dc;

					// Verifica se a nova casa está dentro dos limites do tabuleiro
					if (between(newRow, 0, 7) && between(newColumn, 0, 7)) {
						// Verifica se a casa está vazia ou contém uma peça do oponente
						// E, crucialmente, verifica se a casa NÃO está sendo atacada pelo oponente
						if ((board[newRow][newColumn] === 0 || isPieceWhite(newRow, newColumn) !== currentPieceColor) &&
							!isSquareAttacked(newRow, newColumn, attackingColor, board)) {
							updateBoardSquare(newRow, newColumn, true, boardSelectedSquares, setBoardSelectedSquares);
						}
					}
				}
				break;

			case 10:
				updateBoardSquare(i - 1, j + 1, true, boardSelectedSquares, setBoardSelectedSquares)
				break

			case 11:
				updateBoardSquare(i - 1, j - 1, true, boardSelectedSquares, setBoardSelectedSquares)
				break

			case 20:
				updateBoardSquare(i + 1, j + 1, true, boardSelectedSquares, setBoardSelectedSquares)
				break

			case 21:
				updateBoardSquare(i + 1, j - 1, true, boardSelectedSquares, setBoardSelectedSquares)
				break
		}


		const rightLimit = j >= 8
		const leftLimit = j <= -1
		const upLimit = i <= -1
		const downLimit = i >= 8


		switch (direction) {
			case 'right':
				if (rightLimit) return
				break
			case 'left':
				if (leftLimit) return
				break

			case 'up':
				if (upLimit) return
				break

			case 'down':
				if (downLimit) return
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

				recursiveSelection(i, j + 1, 'right', -1)
				break

			case 'left':

				recursiveSelection(i, j - 1, 'left', -1)
				break

			case 'up':

				recursiveSelection(i - 1, j, 'up', -1)
				break

			case 'down':
				recursiveSelection(i + 1, j, 'down', -1)
				break

			case 'upRight':
				recursiveSelection(i - 1, j + 1, 'upRight', -1)
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

	// useEffect(() => {
	// 	console.log(`início: ${move[0][0]}, ${move[0][1]}`);
	// 	console.log(`fim: ${move[1][0]}, ${move[1][1]}`);

	// 	moveIndex++


	// 	if (move[1].toString() !== [-1, -1].toString()) {
	// 		setGame(prevGame => {
	// 			const newGame = [...prevGame];
	// 			newGame.push(move);

	// 			if (newGame.length > 0 && newGame[0][1] && newGame[0][1].length === 0) {
	// 				newGame.shift();
	// 			}
	// 			return newGame;
	// 		});

	// 		// console.log(game);

	// 	}

	// }, [move]);


	return (
		<main>
			<div className="App">
				<section className='previous-games w-border'>

				</section>
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
										return <div className={`board-square ${boardSelectedSquares[i][j] ? 'board-square--selected' : ''} ${(i == boardCheck[0] && j == boardCheck[1]) ? "board-square--check" : ""}`} onClick={() => handleSquareSelection(i, j)}
											key={i * 8 + j}
											column={j}
											row={i}>
											<img src={boardPieces[board[i][j]]} className='img-piece' />
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
						<div class="button-wrapper--row">
							<button className='button' onClick={() => boardStartingPosition()}>
								Starting position
							</button>
							<button className='button' onClick={() => copyGameToClipboard()}>
								Copy moves to clipboard
							</button>
						</div>
						<hr />
						<section className='button-wrapper'>
							<button className='button button-white' onClick={() => {
								// vitória pretas
								const oldGame = game
								oldGame.push([[0, 1], [0, 1]])

								gameEnd("0-1")
							}}>
								White: resign
							</button>
							<button className='button button-gray' onClick={() => {
								const oldGame = game
								oldGame.push([[0.5, 0], [0.5, 0]])

								// setGameNotation([...gameNotation, "½-½"])
								// boardStartingPosition("½-½")
								gameEnd("½-½")
							}}>
								Draw
							</button>
							<button className='button' onClick={() => {
								// vitória brancas
								const oldGame = game
								oldGame.push([[1, 0], [1, 0]])

								gameEnd("1-0")

							}}>
								Black: resign
							</button>

						</section>

					</div>
				</div>
				<section>
					<div className={`game-notation-container w-border`}>
						{
							gameNotation.map((r, i) => <>
								{
									(i + 1) % 2 != 0 ? <span>{(i + 2) / 2}. </span> : ''
								}
								<span style={{ marginRight: 7 }} className={i + 1 == (moveIndex) ? "p--selected" : ""} key={i}>{r}</span>
								{
									(i + 1) % 2 == 0 ? <br /> : ''
								}
							</>)
						}

					</div>
					<div class="move-order">
						<button className={`button`} onClick={() => goBackGameMove()}>
							&#8678;
						</button>
						<button className='button' onClick={() => goForwardGameMove()}>
							&#8680;
						</button>
					</div>
				</section>

			</div>
		</main>
	);
}

export default App;
