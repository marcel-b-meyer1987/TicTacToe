
// FACTORY FUNCTION FOR PLAYER OBJECTS
function Player(name, marker, isHuman) {

    const player = {};

    player.name = name || "Player1";
    player.marker = marker || "X";
    player.isHuman = isHuman || false;
    player.score = 0;

    player.chooseField = () => {
        let freeFields = Game.board.fields.filter((field) => (field != player1.marker) && (field != player2.marker));
        let targetField;
        
        if (player.isHuman) {
            do {
                // prompt human player to choose target field
                targetField = parseInt(prompt("Please enter the number of the field in which to draw your mark (1-9).", ""));
            }
            while (!freeFields.includes(targetField));
        } else {
            do {
                // if not a human player, choose field randomly
                targetField = Math.floor((Math.random() * 8));
            }
            while (!freeFields.includes(targetField));
        }
    };

    player.drawMark = (field) => {
        if ((Game.board.fields[field] != player1.marker) && (Game.board.fields[field] != player2.marker)) {
            Game.board.fields[field] = player.marker;
        }
    };

    player.makeMove = () => {
        player.drawMark(player.chooseField);
    };

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

        board.Display.showWinner = () => {
            switch (board.Display.mode) {
                case "CONSOLE":
                    console.log(`${winner} wins!`);
                    break;
                case "GUI":
                    alert(`${winner} wins!`);
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
            while (!Game.isOver) {
                Game.players.forEach((player) => player.makeMove());
            };

            if (Game.winner != null) {
                Game.Display.showWinner();
                Game.winner.score++;
                Game.winner = null;

            }
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
            // if game has a winner or ends in a tie (=the game is over), returns true 
            if (Game.winner != null) return true;
            if (Game.isTie) return true;

            // in case the game is not over:
            return false;
        };

        const isTie = () => {

            let outcome = false; //default 

            // return true if no blank fields left + no winner
            for (let i = 0; i < Game.board.fields.length; i++) {
                if ((Game.board.fields[i] != player1.marker) && (Game.board.fields[i] != player2.marker) && (Game.winner === null)) {
                    outcome = true;
                }
            }

            // else, return false (default)
            return outcome;
        };

        const winner = () => {
            let winner = null; //default 

            // 0 1 2
            // 3 4 5
            // 6 7 8

            // 3 horizontal matches
            if ((Game.board.fields[0] === Game.board.fields[1]) && (Game.board.fields[0] === Game.board.fields[2])) return getWinner(Game.board.fields[0]);
            if ((Game.board.fields[3] === Game.board.fields[4]) && (Game.board.fields[3] === Game.board.fields[5])) return getWinner(Game.board.fields[3]);
            if ((Game.board.fields[6] === Game.board.fields[7]) && (Game.board.fields[6] === Game.board.fields[8])) return getWinner(Game.board.fields[6]);

            // 3 vertical matches
            if ((Game.board.fields[0] === Game.board.fields[3]) && (Game.board.fields[0] === Game.board.fields[6])) return getWinner(Game.board.fields[0]);
            if ((Game.board.fields[1] === Game.board.fields[4]) && (Game.board.fields[1] === Game.board.fields[7])) return getWinner(Game.board.fields[1]);
            if ((Game.board.fields[2] === Game.board.fields[5]) && (Game.board.fields[2] === Game.board.fields[8])) return getWinner(Game.board.fields[2]);

            // 2 diagonal matches
            if ((Game.board.fields[0] === Game.board.fields[4]) && (Game.board.fields[0] === Game.board.fields[8])) return getWinner(Game.board.fields[0]);
            if ((Game.board.fields[2] === Game.board.fields[4]) && (Game.board.fields[2] === Game.board.fields[6])) return getWinner(Game.board.fields[2]);

            return winner;
        };

        const getWinner = (markerInField) => {
            let winner = Game.players.filter((player) => player.marker === markerInField);
            return winner;
        };

    return { board, players, isMultiplayer, setMultiplayer, setup, init, reset, play, isOver, isTie, winner, getWinner };

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
