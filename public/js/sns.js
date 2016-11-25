var sns = new SNSClient("demokey", {
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

  app.logs.unshift(JSON.stringify(n, null, 2));

  switch(n.action) {

    case "playersync":
      app.players = n.data;
      app.whoAmI(sns.id);
      break;

    case "turn":
      // mark this square as played
      app.squares[n.square][n.player] = true;
      app.check.play();
      
      // check for winning combos for this player
      var winner = app.checkWinners(app.turn);

      if (winner) {
        app.status = app.turn;
        app.turn = (app.turn === "o" ? "x" : "o");
        $('#gameOver').modal('show');
        return;
      }

      var draw = app.checkDraw();

      if (draw) {
        app.status = "d";
        app.turn = (app.turn === "o" ? "x" : "o");
        $('#gameOver').modal('show');
        return;
      }

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
      $('#playerLeft').modal('hide');
      break;

    case "cancel":
      window.location = "/";
      break;

    case "playerquit":
      app.quit(n.id)
      break;
  }

})