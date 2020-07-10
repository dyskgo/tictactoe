
//Event Delegation
function getEventTarget(e) {
    e = e || window.event; 
    return e.target || e.srcElement; 
}

//Factory Function for Player 
const player = function(name, player) {
    return {name, player}
}

//IIFE for the Gameboard
const gameboard = (function() {
    let grid = [
            ['N', 'N', 'N'],
            ['N', 'N', 'N'],
            ['N', 'N', 'N']
        ];
    return {grid}; 
})(); 

//IIFE for Game 
const game = (function() {
    let tictactoe = document.getElementById('tictactoe');
    let submit = document.getElementById('submit');
    let playerOneInput = document.getElementById('player-one'); 
    let playerTwoInput = document.getElementById('player-two');
    let form = document.getElementById('player-names')
    let playerOne; 
    let playerTwo;
    let currentPlayer = playerOne;
    let hasWinner = false;
    let hasGameBegun = 0;
    let emptySpaces = 0; 

    const render = function() {
        for (i = 0; i <= 2; i++) {
            for (j = 0; j <= 2; j++) {
                if (gameboard.grid[i][j] === 'X' || gameboard.grid[i][j] === 'O') {
                    document.getElementById(`${i}${j}`).innerHTML = gameboard.grid[i][j];
                } else {
                    document.getElementById(`${i}${j}`).innerHTML = '';
                }   
            }
        }
    };  

    const createPlayers = function(e) {
        game.clearBoard(); 
        let playerOneName = playerOneInput.innerHTML;
        let playerTwoName = playerTwoInput.innerHTML; 
        playerOne = player(playerOneName, 1); 
        playerTwo = player(playerTwoName, 2); 
        playerOneInput.style.backgroundColor = 'blue';
        tictactoe.addEventListener('click', playGame);
        form.reset();
        e.preventDefault(); 
    }

    function createVertical(orgArray) {
        let verticalGrid = [
        [orgArray[0][0], orgArray[1][0], orgArray[2][0]],
        [orgArray[0][1], orgArray[1][1], orgArray[2][1]],
        [orgArray[0][2], orgArray[1][2], orgArray[2][2]]
        ]; 
        return verticalGrid; 
    }

    function createDiagonal(orgArray) {
        let diagonalGrid = [
        [orgArray[0][0], orgArray[1][1], orgArray[2][2]],
        [orgArray[0][2], orgArray[1][1], orgArray[2][0]]
        ];
        return diagonalGrid; 
    }

    const gameOver = function() {
        tictactoe.removeEventListener('click', playGame);
        if (emptySpaces === 0 && hasWinner === false) {
            document.getElementById('result').innerHTML = 'It\'s a tie, baby!';
        }
        else if (currentPlayer === playerTwo) {
            document.getElementById('result').innerHTML = `${playerOne.name} wins the game!`;
            playerTwoInput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        } else if (currentPlayer === playerOne) {
            document.getElementById('result').innerHTML = `${playerTwo.name} wins the game!`;
            playerOneInput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        }
    }

    const gameCheck = function() {
        let currentPlayerToken;
        if (currentPlayer === playerTwo) {
            currentPlayerToken = 'X'; 
        } 
        else {
            currentPlayerToken = 'O';
        }
        let horizontal = gameboard.grid; 
        let vertical = createVertical(gameboard.grid);
        let diagonal = createDiagonal(gameboard.grid); 
        let win = currentPlayerToken + currentPlayerToken + currentPlayerToken;
        for (i = 0; i <= 2; i++) {
            let check = horizontal[i].join('');
            if (check === win) {
                hasWinner = true; 
                break; 
            }
            check = vertical[i].join('');
            if (check === win) {
                hasWinner = true;
                break; 
            }
            if (i === 2) break;
            check = diagonal[i].join(''); 
            if (check === win) {
                hasWinner = true; 
                break; 
            }
        }
        emptySpaces = 0; 
        for (i = 0; i <= 2; i++) {
            for (j = 0; j <= 2; j++) {
                if (gameboard.grid[i][j] === 'N') {
                emptySpaces++; 
            }
        }
    }
    }

    const play = function(e) {
        if (hasGameBegun === 0) {
            currentPlayer = playerOne; 
            hasGameBegun++; 
        }
        let target = getEventTarget(e);
        if (target.innerHTML !== '') return;
        let numRow = Number(target.id.charAt(0));
        let numCol = Number(target.id.charAt(1)); 
        if (currentPlayer === playerOne) {
            gameboard.grid[numRow][numCol] = 'X'; 
            currentPlayer = playerTwo; 
            playerOneInput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            playerTwoInput.style.backgroundColor = 'blue'; 
        }
        else if (currentPlayer === playerTwo) {
            gameboard.grid[numRow][numCol] = 'O';
            currentPlayer = playerOne; 
            playerTwoInput.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            playerOneInput.style.backgroundColor = 'blue'; 
        }
        render(); 
        gameCheck();
        if (hasWinner || emptySpaces === 0 && hasWinner === false) {
            gameOver(); 
        }
    }

    const clearBoard = function() {
        hasGameBegun = 0; 
        hasWinner = false;
        document.getElementById('result').innerHTML = '';
        gameboard.grid = [
                        ['N', 'N', 'N'],
                        ['N', 'N', 'N'], 
                        ['N', 'N', 'N']
                    ];
        render();
    }

    //Event Listener Functions - Split off from the event listeners for sake of clarity
    function playGame(e) {
    game.play(e);
    }

    function setNames(e) {
    game.createPlayers(e);
    }

    //Event Listeners
    submit.addEventListener('click', setNames);

    return {play, clearBoard, createPlayers}; 
})(); 

