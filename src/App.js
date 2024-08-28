import React, { useRef, useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { gameReducer, gameActions } from './gameSlice';

const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

const App = () => {
  const dispatch = useDispatch();
  const {
    board,
    isGameActive,
    currentPlayer,
    statusPlayer1,
    statusPlayer2,
    score,
    messagesOut,
    messagesReceived
  } = useSelector((state) => state.game);

  const firstRefInputValue = useRef(null);
  const secondRefInputValue = useRef(null);
  const chatContainerRefFirst = useRef(null);
  const chatContainerRefSecond = useRef(null);

  const startGame = () => {
    dispatch(gameActions.startGame());
  };

  const handleClick = (index) => {
    dispatch(gameActions.handleClick(index));
  };

  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  useEffect(() => {
    const winner = calculateWinner(board);

    if (winner) {
      if (isGameActive) {
        dispatch(gameActions.setWinner(winner));

        setTimeout(() => {
          dispatch(gameActions.resetGame());
        }, 5000);
      }
    } else if (board.every(Boolean)) {
      dispatch(gameActions.setDraw());

      setTimeout(() => {
        dispatch(gameActions.resetGame());
      }, 5000);
    }

  }, [board, isGameActive, dispatch]);

  const sendMessage = (player) => {
    const messageContentValue = player === 'Player 1' ? firstRefInputValue.current.value : secondRefInputValue.current.value;
    if (messageContentValue) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const outgoingMessage = (
        <div className='outgoing-chat'>
          <div className='outgoing-chat-msg'>
            <p className='msg-text-outgoing'>
              {messageContentValue}
              <span className='time'>{currentTime}</span>
            </p>
          </div>
        </div>
      );

      const receivedMessage = (
        <div className='received-msg'>
          <div className='received-msg-inbox'>
            <p className='msg-text-recived'>
              {messageContentValue}
              <span className='time'>{currentTime}</span>
            </p>
          </div>
        </div>
      );

      if (player === 'Player 1') {
        dispatch(gameActions.setMessages({
          messagesOut: [...messagesOut, outgoingMessage],
          messagesReceived: [...messagesReceived, receivedMessage]
        }));
      } else {
        dispatch(gameActions.setMessages({
          messagesReceived: [...messagesReceived, outgoingMessage],
          messagesOut: [...messagesOut, receivedMessage]
        }));
      }

      if (player === 'Player 1') firstRefInputValue.current.value = '';
      if (player === 'Player 2') secondRefInputValue.current.value = '';
    }
    scrollUpdate(player === 'Player 1' ? chatContainerRefFirst : chatContainerRefSecond);
  };

  const handleKeyPress = (event, player) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage(player);
    }
  };

  const scrollUpdate = (ref) => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  return (
    <div className="container">
      <div className="header">
        <span className='span-pl-one'>Player 1</span>
        <div className="score-reset">
          <span>Score: {score.player1}:{score.player2}</span>
          <div>
            <button onClick={startGame}>Reset</button>
          </div>
        </div>
        <span className='span-pl-two'>Player 2</span>
      </div>
      <div className="main">
        <div className='first-player'>
          <div className='p-header'>
            <h1>{statusPlayer1}</h1>
          </div>
          <div className={`p-main ${currentPlayer === 'Player 2' ? 'non-active-area' : ''}`}>
            <div className="game-area">
              {board.map((cell, index) => (
                <div
                  className='game-block'
                  key={index}
                  onClick={() => handleClick(index)}>
                  {cell && (cell === 'Player 1' ? <i className="fa-solid fa-x"></i> : <i className="fa-solid fa-o"></i>)}
                </div>
              ))}
              <div className='net-vertical'></div>
              <div className='net-horisontal'></div>
            </div>
          </div>
          <div className='p-footer'>
            <div className="chat">
              <div className="chat-header">
                <span><i className="fa-regular fa-circle-user"></i>Player 1</span>
              </div>
              <div className="chat-main" ref={chatContainerRefFirst}>
                {messagesOut}
              </div>
              <div className='message'>
                <input type="text" placeholder='Message' ref={firstRefInputValue} onKeyDown={(e) => handleKeyPress(e, 'Player 1')} />
                <i className="fa-solid fa-paper-plane" onClick={() => sendMessage('Player 1')}></i>
              </div>
            </div>
          </div>
        </div>
        <div className={`second-player`}>
          <div className='p-header'>
            <h1>{statusPlayer2}</h1>
          </div>
          <div className={`p-main ${currentPlayer === 'Player 1' ? 'non-active-area' : ''}`}>
            <div className="game-area">
              {board.map((cell, index) => (
                <div
                  className='game-block'
                  key={index}
                  onClick={() => handleClick(index)}>
                  {cell && (cell === 'Player 1' ? <i className="fa-solid fa-x"></i> : <i className="fa-solid fa-o"></i>)}
                </div>
              ))}
              <div className='net-vertical'></div>
              <div className='net-horisontal'></div>
            </div>
          </div>
          <div className='p-footer'>
            <div className="chat">
              <div className="chat-header">
                <span><i className="fa-regular fa-circle-user"></i>Player 2</span>
              </div>
              <div className="chat-main" ref={chatContainerRefSecond}>
                {messagesReceived}
              </div>
              <div className='message'>
                <input type="text" placeholder='Message' ref={secondRefInputValue} onKeyDown={(e) => handleKeyPress(e, 'Player 2')} />
                <i className="fa-solid fa-paper-plane" onClick={() => sendMessage('Player 2')}></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default WrappedApp;
