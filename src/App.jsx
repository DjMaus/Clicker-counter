import React, { useState, useEffect } from 'react';
import logo from './assets/clicker.png';

const App = () => {
    const [count, setCount] = useState(0); // User's click count
    const [gameTimer, setGameTimer] = useState(10); // Game timer (10 seconds)
    const [prepTimer, setPrepTimer] = useState(5); // Pre-game countdown timer
    const [isGameActive, setIsGameActive] = useState(false); // Is the game timer running?
    const [isPrepActive, setIsPrepActive] = useState(false); // Is the pre-game countdown running?
    const [hasStarted, setHasStarted] = useState(false); // Has the game started?
    const [leaderboard, setLeaderboard] = useState([]); // Leaderboard for top scores
    const [isGameOver, setIsGameOver] = useState(false); // Is the game over?

    // Start the pre-game countdown
    const startGame = () => {
        setCount(0); // Reset clicks
        setPrepTimer(5); // Reset pre-game countdown
        setGameTimer(10); // Reset game timer to 10 seconds
        setIsPrepActive(true); // Start pre-game countdown
        setHasStarted(true); // Mark game as started
        setIsGameOver(false); // Reset game over state
    };

    // Pre-game countdown logic
    useEffect(() => {
        let prepInterval = null;
        if (isPrepActive && prepTimer > 0) {
            prepInterval = setInterval(() => {
                setPrepTimer((prev) => prev - 1);
            }, 1000);
        } else if (prepTimer === 0) {
            setIsPrepActive(false); // Stop pre-game countdown
            setIsGameActive(true); // Start the game timer
        }
        return () => clearInterval(prepInterval); // Cleanup the interval
    }, [isPrepActive, prepTimer]);

    // Game timer logic
    useEffect(() => {
        let gameInterval = null;
        if (isGameActive && gameTimer > 0) {
            gameInterval = setInterval(() => {
                setGameTimer((prev) => prev - 1);
            }, 1000);
        } else if (gameTimer === 0 && !isGameOver) {
            setIsGameActive(false); // Stop the game timer
            setIsGameOver(true); // Mark the game as over

            // Add the score to the leaderboard (only once)
            setLeaderboard((prev) =>
                [...prev, count].sort((a, b) => b - a).slice(0, 5)
            );
        }
        return () => clearInterval(gameInterval); // Cleanup the interval
    }, [isGameActive, gameTimer, isGameOver]);

    // Function to dynamically generate header text based on game state
    const getHeaderText = () => {
        if (!hasStarted) return (
            <>How fast can you click in 10 seconds? <br/>
                Click Start Game to find out!
            </>
        )
        if (isPrepActive) return 'Get Ready...';
        if (isGameActive) return 'Click as Fast as You Can!';
        if (isGameOver) return 'Time\'s Up! Check Your Score!';
        return 'Click Challenge';
    };

    return (
        <div className="app">
            <img src={logo} alt="App Logo" className="logo" />
            <h1>{getHeaderText()}</h1> {/* Dynamic Header Text */}

            {!hasStarted ? (
                // Show "Start Game" button before game begins
                <button className="start" onClick={startGame}>
                    Start Game
                </button>
            ) : isPrepActive ? (
                // Show pre-game countdown
                <div>
                    <h2>Starting in: {prepTimer}s</h2>
                </div>
            ) : gameTimer > 0 ? (
                // During the game, show game timer and clicks
                <div>
                    <h2>Time Left: {gameTimer}s</h2>
                    <h2>Clicks: {count}</h2>
                    <button
                        className="click-button"
                        onClick={() => setCount((prev) => prev + 1)}
                        disabled={!isGameActive}
                    >
                        Click Me!
                    </button>
                </div>
            ) : isGameOver ? (
                // After the game ends, show the result with "Back to Start" button
                <>
                    <h2>You clicked {count} times!</h2>
                    <div className= "back-to-start-container">
                    <button className="reset" onClick={() => setHasStarted(false)}>
                        Back to Start
                    </button>
                </div>
                </>
            ) : null}

            <div className="leaderboard">
                <h2>Leaderboard</h2>
                {leaderboard.length > 0 ? (
                    <ol>
                        {leaderboard.map((score, index) => (
                            <li key={index}>Score: {score}</li>
                        ))}
                    </ol>
                ) : (
                    <p>No scores yet. Be the first to play!</p>
                )}
            </div>
        </div>
    );
};

export default App;
