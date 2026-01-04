

function Player(name, marker, isHuman) {
    this.name = name || "Player1";
    this.marker = marker || "X";
    this.isHuman = isHuman || false;
}

const Game = (function() {

    this.isMultiplayer = false;

    this.players = [];

    this.board = {
        field: [],
        reset: () => {
            for (let i = 0; i <= 9; i++) {
                    this.field[i] = "";
                }
        },
        renderDisplay: () => {
            //render the display of the game board
            //first in the console, later in the GUI
        }
    };

    this.setup = function() {
        const startBtn = document.getElementById("start-button");
        startBtn.addEventListener("click", (e) => {
            Game.init();
        });
    }

    this.setMultiplayer = () => {
        //ask if player wants Multiplayer and return true or false
        let multi = "";
        while (! (multi === "y" || multi === "n")) {
            multi = prompt("Please advise if you want to play in Multiplayer mode (y/n)", "n");
        }
         
        return (multi === "y") ? true : false;
    }

    this.play = () => {

    //     while nobody has won && there are still empty fields left:
    //         playRound {
    //             players.forEach(player => player.makeMove),
    //             if emptyFieldsLeft continue,
    //             else: GameOver + display Draw!
    //         }
    //         if (3-in-a-row) => gameOver + display winner, 
    //         ask if players want new game? If yes, reset!
    // }

    }

    this.gameOver = function(winner) {
        if(winner) {
            // displayWinner
        } else {
            // displayDraw
        }
        
        // ask if player wants to play again?
    }

    this.init = () => {
        //ask if 1 or 2 players? --- set isMultiplayer to true or false // TESTED OK
        this.isMultiplayer = this.setMultiplayer();

        //create player objects // TESTED OK
        let player1 = new Player("Player 1", "X", true);
        let player2 = new Player("Player 2", "O", this.isMultiplayer);

        this.players.push([player1, player2]);

        //reset game board
        this.board.reset();

        //start gameloop = this.play();
        this.play();

    }

    this.reset = () => {
              this.board.reset();
              this.startGame();  
            } 

    return { players, setup, init, reset };

})();


//To start the game, link the Start-Button to Game.start():
Game.setup();

// LENI MEYER

// ROBERT MEYER