
// FACTORY FUNCTION FOR PLAYER OBJECTS
function Player(name, marker, isHuman) {

    const player = {};

    player.name = name || "Player1";
    player.marker = marker || "X";
    player.isHuman = isHuman || false;
    player.score = 0;

    player.chooseField = () => {        // MUST BE DEBUGGED
        let freeFields = Game.board.getFreeFields();
        let targetField;
        
        if (player.isHuman) {
            do {
                // prompt human player to choose target field
                targetField = parseInt(prompt("Please enter the number of the field in which to draw your mark (1-9).", ""));
            }
            while (!freeFields.includes(targetField) || targetField < 1 || targetField > 9);
        } else {
            do {
                // if not a human player, choose field randomly
                targetField = Math.floor((Math.random() * 9));
            }
            while (!freeFields.includes(targetField));
        }

        return targetField;
    };

    player.drawMark = (field) => {
        let index = field-1;
        // if ((Game.board.fields[index] != Game.players[0].marker) && (Game.board.fields[index] != Game.players[1].marker)) {
        //     Game.board.fields[index] = player.marker;
        //     Game.board.Display.draw();
        // }
        Game.board.fields[index] = player.marker;
        Game.board.Display.draw();
    };

    player.makeMove = () => {
        player.drawMark(player.chooseField());
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
                    console.clear();
                    const consoleOutput = board.Display.renderForConsole();
                    for (let i = 0; i < consoleOutput.length; i++) {
                        console.log(consoleOutput[i] || " ");
                    }
                    break;

                case "GUI":
                    console.warn("GUI drawing mode not implemented yet");
                    board.Display.setMode("toConsole");
                    board.Display.draw();
                    break;
            }
        };

        board.Display.showTie = () => {
            switch (board.Display.mode) {
                case "CONSOLE":
                    console.log(`The game result is a tie!`);
                    break;
                case "GUI":
                    alert(`The game result is a tie!`);
                    break;
            }
        };

        board.Display.showWinner = () => {
            let winner = Game.hasWinner();
            switch (board.Display.mode) {
                case "CONSOLE":
                    console.log(`${winner} wins!`);
                    break;
                case "GUI":
                    alert(`${winner} wins!`);
                    break;
            }
        };

        board.getFreeFields = () => {       // TESTED OK
            let freeFields = [];
            switch(board.Display.spacer) {
                case "numbers":
                    board.fields.forEach((value, index) => { 
                        if(!isNaN(value)) freeFields.push(index);
                    });
                    break;
                case "blanks":
                    board.fields.forEach((value, index) => { 
                        if((value === " ") || (value === NaN)) freeFields.push(index);
                    });
                    break;
            }
            return freeFields;
        }

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

            board.reset();
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

        const playAgain = () => {
            // ask if player wants to play again after game over
            let again ="";

            switch (board.Display.mode) {
                case "CONSOLE":
                    while (! (again === "y" || again === "n")) {
                        again = prompt("Do you want to play again?\n (y/n)", "n");
                    }
                    return (again === "y") ? true : false;

                default:
                    // implementation for GUI mode should come here
                    // FOR NOW: SAME AS CONSOLE MODE!
                    while (! (again === "y" || again === "n")) {
                        again = prompt("Do you want to play again?\n (y/n)", "n");
                    }
                    return (again === "y") ? true : false;
            }

            // fallback
            return false;
        };

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

            Game.players = [player1, player2];
            // Game.winner = null;


            //reset game board
            Game.board.reset();
            Game.board.Display.draw();

            Game.play();
        };       

        const reset = () => {
            Game.board.reset();
            Game.play();
        };


        // ++++++++++++++++ GAME CONTROL FLOW LOGIC ++++++++++++++++

        const play = () => {

            // contains the game loop
            //while (!Game.isOver()) { --- commented out for testing with hard coded infinite loop
            while (!Game.isOver()) {
                Game.players[0].makeMove();
                Game.players[1].makeMove();
            };

            if (Game.hasWinner() != null) {
                Game.board.Display.showWinner();
                Game.hasWinner.score++;
                // Game.winner = null;
            } else {
                Game.board.Display.showTie();
            }

            if(playAgain()) {
                Game.init();
            } else {
                return;
            }

        };

        const isOver = () => {      // TESTED OK
            // if game has a winner or ends in a tie (=the game is over), returns true 
            if (Game.hasWinner()) return true;
            if (Game.isTie()) return true;

            // in case the game is not over:
            return false;
        };

        const isTie = () => {       // TESTED OK
            
            // if no more free fields AND if there is no winner, the game is a tie
            return (Game.board.getFreeFields().length < 1) && (!Game.hasWinner());

            // let outcome = true; 

            // // if there is at least one field which has neither the marker of player 1 or player 2 as value (=is still free), the game is no tie (yet)
            // for (let i = 0; i < Game.board.fields.length; i++) {
            //     if ((Game.board.fields[i] != Game.players[0].marker) && (Game.board.fields[i] != Game.players[1].marker)) {
            //         outcome = false;
            //         break;
            //     }
            // }

            // return outcome;
        };

        const hasWinner = () => {       // TESTED OK

            // 0 1 2
            // 3 4 5
            // 6 7 8

            // check for 3 horizontal matches
            if ((Game.board.fields[0] != " ") && (Game.board.fields[0] === Game.board.fields[1]) && (Game.board.fields[1] === Game.board.fields[2])) {
                return Game.getWinner(Game.board.fields[0]);
            }
            if ((Game.board.fields[3] != " ") && (Game.board.fields[3] === Game.board.fields[4]) && (Game.board.fields[4] === Game.board.fields[5])) {
                return Game.getWinner(Game.board.fields[3]);
            }
            if ((Game.board.fields[6] != " ") && (Game.board.fields[6] === Game.board.fields[7]) && (Game.board.fields[7] === Game.board.fields[8])) {
                return Game.getWinner(Game.board.fields[6]);
            }

            // check for 3 vertical matches
            if ((Game.board.fields[0] != " ") && (Game.board.fields[0] === Game.board.fields[3]) && (Game.board.fields[0] === Game.board.fields[6])) {
                return Game.getWinner(Game.board.fields[0]);
            }
            if ((Game.board.fields[1] != " ") && (Game.board.fields[1] === Game.board.fields[4]) && (Game.board.fields[1] === Game.board.fields[7])) {
                return Game.getWinner(Game.board.fields[1]);
            }
            if ((Game.board.fields[2] != " ") && (Game.board.fields[2] === Game.board.fields[5]) && (Game.board.fields[2] === Game.board.fields[8])) {
                return Game.getWinner(Game.board.fields[2]);
            }

            // check for 2 diagonal matches
            if ((Game.board.fields[0] != " ") && (Game.board.fields[0] === Game.board.fields[4]) && (Game.board.fields[0] === Game.board.fields[8])) {
                return Game.getWinner(Game.board.fields[0]);
            }
            if ((Game.board.fields[2] != " ") && (Game.board.fields[2] === Game.board.fields[4]) && (Game.board.fields[2] === Game.board.fields[6])) {
                return Game.getWinner(Game.board.fields[2]);
            } 

            return null;
        };

        const getWinner = (markerInField) => {      // TESTED OK
            return Game.players.filter((player) => player.marker === markerInField)[0];
        };

    return { board, players, isMultiplayer, setMultiplayer, setup, init, reset, play, isOver, isTie, hasWinner, getWinner };

}());



//To start the game, link the Start-Button to Game.start():
Game.setup();


// FOR MANUAL TESTING
function showDemo() {
    Game.board.setFieldsToDemo();
    Game.board.Display.setMode("toConsole");
    Game.board.Display.draw();
}

function testWin() {
    Game.init();
    Game.board.fields = ["X","O","O","O","X","X","O","O","O"];
    Game.board.Display.draw();
    console.log("Winner:", Game.hasWinner());

    Game.init();
    Game.board.fields = ["X","X","X","O","X","X","O","O","X"];
    Game.board.Display.draw();
    console.log("Winner:", Game.hasWinner());
}


// LENI MEYER

// ROBERT MEYER

// DIETER
