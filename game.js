
// FACTORY FUNCTION FOR PLAYER OBJECTS
function Player(name, marker, isHuman, game) {

    const player = {};

    player.name = name || "Player1";
    player.marker = marker || "X";
    player.isHuman = isHuman || false;
    player.activeTurn = false;
    player.score = 0;

    player.chooseField = () => {        
        let freeFields = [];
        let targetField;
        
        
        if (player.isHuman) {
            switch(Game.board.Display.mode) {

                case "CONSOLE":
                    
                    freeFields = Game.board.getFreeFields();
                    do {
                        // prompt human player to choose target field
                        targetField = parseInt(prompt("Please enter the number of the field in which to draw your mark (1-9).", ""));
                    }
                    while (!freeFields.includes(targetField-1)) // || targetField < 1 || targetField > 9);
                    break;

                default:
                    
                    // get free fields on the UI board
                    freeFields = Game.board.getFreeFields_UI();

                    // add click event listeners to all the free fields
                    freeFields.forEach(field => field.addEventListener("click", function choose(e) {
                        
                        // save the number of the e.target field in targetField
                        targetField = e.target.dataset["fieldNumber"];

                        // remove the event listeners
                        freeFields.forEach(field => field.removeEventListener("click", choose));

                        // return targetField
                        return targetField;
                    }));                        
            }
            
        } else {
            // get free fields on the UI board
            freeFields = Game.board.getFreeFields_UI();

            do {
                // if not a human player, choose field randomly
                targetField = Math.floor((Math.random() * 9));
            }
            while (!freeFields.map(field => field.dataset["fieldNumber"]).includes(targetField-1));
        }

        return targetField;
    };

    player.drawMark = (field) => {
        let index = field-1;
        switch(Game.board.Display.mode) {
            case "CONSOLE":
                Game.board.fields[index] = player.marker;
                Game.board.Display.draw();
                break;

            default:
                Game.board.fields[index] = player.marker;
                Game.board.Display.draw();
                break;
        }
    };

    player.makeMove = () => {
        if(!Game.isOver()) {
            player.activeTurn = true;
            player.drawMark(player.chooseField());
            player.activeTurn = false;
        }
        
    };

    return player;
};



// GENERATE GAME OBJECT
const Game = (function() {

    const info = document.getElementById("info");
    const showInfo = (msg) => {
        switch (Game.board.Display.mode) {
            case "CONSOLE":
                console.log(msg);
                break;
            default:
                info.innerText = msg;
                break;       
        }
    };

    // ++++++++++++++++ BOARD ++++++++++++++++

    const board = {};

        board.fields = [];

        board.Display = {};

        board.Display.spacer = "blanks";

        board.Display.mode = "CONSOLE";

        board.Display.setMode = (mode) => {
            if (mode === "toGUI") {
                board.Display.mode = "GUI";
                Array.from(document.querySelectorAll(".GUI-only")).forEach((form) => form.classList.remove("hidden"));
                board.Display.UI = document.getElementById("GUI-gameboard");
                board.Display.UI.fields = Array.from(Game.board.Display.UI.children);                
                console.log("Display Mode: GUI");
            } else {
                board.Display.mode = "CONSOLE";
                Array.from(document.querySelectorAll(".GUI-only")).forEach((form) => form.classList.add("hidden"));
                console.log("Display Mode: Console");
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

                default:
                    for (let i = 0; i < 9; i++) {
                        Game.board.Display.UI.fields[i].innerText = Game.board.fields[i];
                    }
                    break;

                    // console.warn("GUI drawing mode not implemented yet");
                    // board.Display.setMode("toConsole");
                    // board.Display.draw();
                    // break;
            }
        };

        board.Display.showGoodbye = () => {
            Game.showInfo("Thanks for playing! Have a nice day!");
        };

        board.Display.showScores = () => {
            Game.showInfo(
                `SCORES:\n\n
                ${Game.players[0].name}: ${Game.players[0].score} \n
                ${Game.players[1].name}: ${Game.players[1].score} \n`);
        };

        board.Display.showTie = () => {
            Game.showInfo(`The game result is a tie!`);
        };

        board.Display.showWinner = () => {
            let winner = Game.hasWinner();
            Game.showInfo(`${winner.name} wins!`);
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

        board.getFreeFields_UI = () => {        // TESTED OK
            let uiFields = Array.from(document.getElementById("GUI-gameboard").children);
            return uiFields.filter(field => field.innerHTML != "X" && field.innerHTML != "O");
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

            switch (board.Display.mode) {
                case "CONSOLE":
                    let multi = "";
                    while (! (multi === "y" || multi === "n")) {
                        multi = prompt("Please advise if you want to play in Multiplayer mode.\n (y/n)", "n");
                    }
                    return (multi === "y") ? true : false;

                default:
                    const playerModeSelector = document.getElementById("player-mode");
                    if (playerModeSelector.value === "multi") {
                        return true;
                    } else {
                        return false;
                    } 
            };
        };

        const enterPlayerName = () => {
            switch (board.Display.mode) {
                case "CONSOLE":
                    let name = "";
                    while (name == "") {
                        name = prompt("Please enter your name.\n", "Player 1");
                    }
                    return name;

                default:
                    return document.querySelector("input#name").value || "Player 1";
            }
        }


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
                        again = prompt("Do you want to play again?\n (y/n)", "y");
                    }
                    return (again === "y") ? true : false;
            }

            // fallback
            return false;
        };


        const setup = () => {
            const GUIBoard = document.getElementById("GUI-gameboard");
            const startBtn = document.getElementById("start-button");
            startBtn.addEventListener("click", (e) => {
                displayModeSelector.classList.add("hidden");
                Array.from(document.querySelectorAll(".GUI-only")).forEach((form) => form.classList.add("hidden"));
                startBtn.classList.add("hidden");
                GUIBoard.classList.remove("hidden");
                setTimeout(init, 1000);
            });
        };
        
        const init = () => {
            Game.isMultiplayer = Game.setMultiplayer();
            console.log(`Multiplayer mode: `, Game.isMultiplayer);

            Game.players[0] = new Player(enterPlayerName() || "Player 1", "X", true, this);
            Game.players[1] = new Player("Player 2", "O", Game.isMultiplayer, this);
            
            Game.board.reset();
            Game.board.Display.draw();
            
            Game.play();
        };       

        const reset = () => {
            Game.board.reset();
            Game.board.Display.draw();
            Game.play();
        };


        // ++++++++++++++++ GAME CONTROL FLOW LOGIC ++++++++++++++++

        const play = () => {

            // contains the game loop
            while (!Game.isOver()) {
                Game.players[0].makeMove();
                Game.players[1].makeMove();
            };

            if (Game.hasWinner() != null) {
                Game.board.Display.showWinner();
                Game.hasWinner().score++;
            } else {
                Game.board.Display.showTie();
            }

            board.Display.showScores();

            if(playAgain()) {
                Game.reset();
            } else {
                board.Display.showGoodbye();
                return;
            }
        };

        const isOver = () => {      // TESTED OK
            // make sure the game board has been set up in the first place (= no field has value undefined)
            if (Game.board.fields[0] != undefined) {
                // if game has a winner or ends in a tie (=the game is over), return true 
                if (Game.hasWinner()) return true;
                if (Game.isTie()) return true;        
            }
            
            // in case the game is not over:
            return false;
        };

        const isTie = () => {       // TESTED OK
            // make sure the game board has been set up in the first place (= no field has value undefined)
            if (Game.board.fields[0] != undefined) {
                // if no more free fields AND if there is no winner, the game is a tie
                return (Game.board.getFreeFields().length < 1) && (!Game.hasWinner());
            }

            // otherwise, return false as default, because the game cannot be a tie if it has not begun
            return false;
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

    return { board, players, isMultiplayer, setMultiplayer, setup, init, reset, play, isOver, isTie, hasWinner, getWinner, info, showInfo };

}());



//To start the game, link the Start-Button to Game.start():
Game.setup();


// FOR MANUAL TESTING
function showDemo() {
    Game.board.setFieldsToDemo();
    Game.board.Display.setMode("toConsole");
    Game.board.Display.draw();
}

function createDemoPlayers() {
    let player1 = new Player("Player 1", "X", true);
    let player2 = new Player("Player 2", "O", false);
    Game.players = [player1, player2];
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


// ++++++++++++++++ UI HANDLING ++++++++++++++++

// enable selection of display mode through UI
const displayModeSelector = document.getElementById("display-mode-field");
displayModeSelector.addEventListener("change", (e) => Game.board.Display.setMode(e.target.value));




// LENI MEYER

// ROBERT MEYER

// DIETER
