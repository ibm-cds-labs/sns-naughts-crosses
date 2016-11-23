var sns = new SNSClient("tyKwRGcA235rfD", {
  userData: {
    gameID: app.gameID
  },
  userQuery: {
    gameID: app.gameID
  }
});

sns.on('connected', function() {
  app.getAvailablePlayer(sns.id);
})

sns.on('notification', function(n) {

  switch(n.action) {

    case "playersync":
      app.players = n.data;
      app.whoAmI(sns.id);
      break;

    case "turn":
      // mark this square as played
      app.squares[n.square][n.player] = true;
      
      // check for winning combos for this player
      var winner = app.checkWinners(app.turn);

      if (winner) {
        app.status = app.turn;
        $('#gameOver').modal('show');
        return;
      }

      var draw = app.checkDraw();

      if (draw) {
        app.status = "d";
        $('#gameOver').modal('show');
        return;
      }

      // alternate whos turn it is
      app.turn = (app.turn === "o" ? "x" : "o");
      break;

    case "reset":
      for(var i in app.squares) {
        app.squares[i].x = false;
        app.squares[i].o = false;
        app.squares[i].win = false;
        app.status = "";
      }
      $('#gameOver').modal('hide');
      break;

    case "cancel":
      window.location = "/";
      break;
  }

})