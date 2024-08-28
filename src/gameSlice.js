import { createSlice } from '@reduxjs/toolkit';

const gameSlice = createSlice({
  name: 'game',
  initialState: {
    board: Array(9).fill(null),
    isGameActive: false,
    currentPlayer: 'Player 1',
    statusPlayer1: 'Press `Reset` to start the game',
    statusPlayer2: 'Press `Reset` to start the game',
    score: { player1: 0, player2: 0 },
    hasGameStarted: false,
    messagesOut: [],
    messagesReceived: [],
  },
  reducers: {
    handleClick: (state, action) => {
      const index = action.payload;
      if (!state.isGameActive || state.board[index]) return;

      const newBoard = [...state.board];
      newBoard[index] = state.currentPlayer;
      state.board = newBoard;
      state.currentPlayer = state.currentPlayer === 'Player 1' ? 'Player 2' : 'Player 1';
      if (state.currentPlayer === 'Player 1') {
        state.statusPlayer1 = 'Your turn';
        state.statusPlayer2 = 'Wait your opponent';
      } else {
        state.statusPlayer2 = 'Your turn';
        state.statusPlayer1 = 'Wait your opponent';
      }
    },
    startGame: (state) => {
      state.isGameActive = true;
      state.currentPlayer = 'Player 1';
      state.statusPlayer1 = 'Your turn';
      state.statusPlayer2 = 'Wait your opponent';
      if (!state.hasGameStarted) {
        state.hasGameStarted = true;
      } else {
        state.board = Array(9).fill(null);
        state.score = { player1: 0, player2: 0 };
        state.messagesOut = [];
        state.messagesReceived = [];
      }
    },
    resetGame: (state) => {
      state.board = Array(9).fill(null);
      state.isGameActive = true;
      state.currentPlayer = 'Player 1';
      state.statusPlayer1 = 'Your turn';
      state.statusPlayer2 = 'Wait your opponent';
    },
    setWinner: (state, action) => {
      const winner = action.payload;
      state.isGameActive = false;
      if (winner === 'Player 1') {
        state.statusPlayer1 = 'You win!';
        state.statusPlayer2 = 'You lose!';
        state.score.player1 += 1;
      } else {
        state.statusPlayer1 = 'You lose!';
        state.statusPlayer2 = 'You win!';
        state.score.player2 += 1;
      }
    },
    setDraw: (state) => {
      state.isGameActive = false;
      state.statusPlayer1 = 'Draw';
      state.statusPlayer2 = 'Draw';
    },
    setMessages: (state, action) => {
      state.messagesOut = action.payload.messagesOut;
      state.messagesReceived = action.payload.messagesReceived;
    },
  },
});

export const { actions: gameActions, reducer: gameReducer } = gameSlice;
