describe("Player Suite", function() {
    Game.board.setFieldsToDemo();
    Game.board.Display.draw();
    // "|x| | |";
    // "| |O|X|";
    // "|O|X| |";

    let player1 = new Player("Player 1", "X", true);
    let player2 = new Player("Player 2", "O", false);

    Game.players = [player1, player2];

});