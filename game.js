
// FACTORY FUNCTION FOR PLAYER OBJECTS
function Player(name, marker, isHuman) {

    const player = {};

    player.name = name || "Player1";
    player.marker = marker || "X";
    player.isHuman = isHuman || false;
    player.score = 0;

    return player;
};



// GENERATE GAME OBJECT
const Game = (function() {

    // ++++++++++++++++ BOARD ++++++++++++++++

    const board = {};

        board.fields = [];

        board.Display = {};

        board.Display.spacer = "blanks";

        board.Display.mode = "CONSOLE";

        board.Display.setMode = (mode) => {
            if (mode === "toGUI") {
                board.Display.mode = "GUI";
            } else {
                board.Display.mode = "CONSOLE"
            }
        };

        board.Display.renderForConsole = () => {
            //render the display of the game board
            //first in the console, later in the GUI

            //DUMMY DISPLAY FOR TESTING:
            const horizontalDivider = "-------";
            const verticalDivider = "|";

            let output = [];

            output[0] = `${verticalDivider}`;
            output[1] = `${verticalDivider}`;
            output[2] = `${verticalDivider}`;

            for (let i = 0; i < 3; i++) {
                output[0] += `${board.fields[i]}${verticalDivider}`; // e. g. "X|2|3|"
            }

            for (let i = 3; i < 6; i++) {
                output[1] += `${board.fields[i]}${verticalDivider}`;
            }

            for (let i = 6; i < 9; i++) {
                output[2] += `${board.fields[i]}${verticalDivider}`; 
            }

            return output;
        };

        board.Display.draw = () => {
            switch(board.Display.mode) {
                case "CONSOLE":
                    // draw field display in console
                    const consoleOutput = board.Display.renderForConsole();
                    for (let i = 0; i < consoleOutput.length; i++) {
                        console.log(consoleOutput[i]);
                    }
                    break;

                case "GUI":
                    console.warn("GUI drawing mode not implemented yet");
                    board.Display.setMode("toConsole");
                    board.Display.draw();
                    break;
            }
        };

        board.reset = () => {
            switch (board.Display.spacer) {
                case "numbers":
                    for (let i = 0; i < 9; i++) {
                        board.fields[i] = `${i+1}`;
                    }
                    break;

                case "blanks":
                    for (let i = 0; i < 9; i++) {
                        board.fields[i] = " ";
                    }
                    break;
                default:
                    for (let i = 0; i < 9; i++) {
                        board.fields[i] = " ";
                    }
                    break;
            }          
        };


        board.setFieldsToDemo = () => {
            // FOR DEMO AND DEBUG USE ONLY

            board.fields[0] = "X";
            board.fields[4] = "O";
            board.fields[5] = "X";
            board.fields[6] = "O";
            board.fields[7] = "X";
            
            // "|x| | |";
            // "| |O|X|";
            // "|O|X| |";

        };


        // ++++++++++++++++ PLAYER SETTINGS ++++++++++++++++

        players = [];

        isMultiplayer = false;

        const setMultiplayer = () => {
            // ask if player wants Multiplayer and return true or false
            // for console mode
            let multi = "";

            switch (board.Display.mode) {
                case "CONSOLE":
                    while (! (multi === "y" || multi === "n")) {
                        multi = prompt("Please advise if you want to play in Multiplayer mode (y/n)", "n");
                    }
                    return (multi === "y") ? true : false;

                default:
                    // implementation for GUI mode should come here
                    // FOR NOW: SAME AS CONSOLE MODE!
                    while (! (multi === "y" || multi === "n")) {
                        multi = prompt("Please advise if you want to play in Multiplayer mode (y/n)", "n");
                    }
                    return (multi === "y") ? true : false;
            }
        };


        // ++++++++++++++++ GENERAL SETUP & BOILER PLATE CODE ++++++++++++++++

        const setup = () => {
            const startBtn = document.getElementById("start-button");
            startBtn.addEventListener("click", (e) => {
                init();
            });
        };
        
        const init = () => {
            //ask if 1 or 2 players? --- set isMultiplayer to true or false // TESTED OK
            Game.isMultiplayer = Game.setMultiplayer();

            //create player objects // TESTED OK
            let player1 = new Player("Player 1", "X", true);
            let player2 = new Player("Player 2", "O", this.isMultiplayer);

            Game.players.push([player1, player2]);

            //reset game board
            Game.board.reset();

            //start gameloop = Game.play();
            Game.play();
        };       

        const reset = () => {
            Game.board.reset();
            Game.play();
        };


        // ++++++++++++++++ GAME CONTROL FLOW LOGIC ++++++++++++++++

        const play = () => {
            // contains the game loop


            //     while nobody has won && there are still empty fields left:
            //         playRound {
            //             players.forEach(player => player.makeMove),
            //             if emptyFieldsLeft continue,
            //             else: isOver + display Draw!
            //         }
            //         if (3-in-a-row) => isOver + display winner, 
            //         ask if players want new game? If yes, reset!
            // }

        };

        const isOver = () => {
            // logic to check if game is over, returns a boolean

            // in case the game is not over:
            return false;
        };


    return { board, players, isMultiplayer, setMultiplayer, setup, init, reset, play, isOver };

}());



//To start the game, link the Start-Button to Game.start():
Game.setup();


// FOR MANUAL TESTING
function showDemo() {
    Game.board.reset();
    Game.board.setFieldsToDemo();
    Game.board.Display.setMode("toConsole");
    Game.board.Display.draw();
}


// LENI MEYER

// ROBERT MEYER
