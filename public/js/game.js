var app = new Vue({
  el: '#app',
  data: {
    gameID: window.location.pathname.split("/")[2],
    turn: "o",
    status: "",
    players: {
      o: null,
      x: null
    },
    me: null,
    squares: {
      0: {
        o: false,
        x: false
      },
      1: {
        o: false,
        x: false
      },
      2: {
        o: false,
        x: false
      },
      3: {
        o: false,
        x: false
      },
      4: {
        o: false,
        x: false
      },
      5: {
        o: false,
        x: false
      },
      6: {
        o: false,
        x: false
      },
      7: {
        o: false,
        x: false
      },
      8: {
        o: false,
        x: false
      }
    },
    logs: [],
    hideLogs: true
  },
  created: function() {
    window.onbeforeunload = function() {
      sns.send({gameID: app.gameID}, { action: "playerquit", id: sns.id })
    }
  },
  methods: {
    toggleLogs: function() {
      app.hideLogs = (app.hideLogs ? false : true );
    },
    takeTurn: function(sqID) {
      
      // make sure we have 2 players
      if (!app.players.x || !app.players.o) {
        return;
      }

      // see if it's your turn
      if (app.players[app.turn] !== sns.id) {
        return;
      }

      // if we don't know who's turn it is, do nothing
      if (app.turn === null) return;

      // if this square is occupied, do nothing
      if (app.isSquareOccupied(sqID)) {
        return;
      }

      // mark this square as occupied
      app.squares[sqID][app.turn] = true;

      sns.send({gameID: app.gameID}, { action: "turn", square: sqID, player: app.turn })

    },
    isSquareOccupied: function(id) {

      return (app.squares[id].x || app.squares[id].o)

    },
    checkWinners: function(player) {

      var winner = false;

      // possible winning combos
      // lowest number always first
      var winningCombos = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,4,8],
        [2,4,6],
        [0,3,6],
        [1,4,7],
        [2,5,8]
      ]

      // get all of the played squares for this player
      var played = [];
      Object.keys(app.squares).map(function(i) {
        if (app.squares[i][player]) {
          played.push(i)
        }
      });
      played.sort();

      // get the unqiue combinations 
      // where at least 3 squares have been played
      played = app.getCombinations(played);

      // check these played combinations against winning combinations
      winningCombos.forEach(function(w) {
        
        w = w.join("").toString();
        played.forEach(function(p) {
          if (winner) return;
          winner = (p === w);

          // highlight winning squares
          if (winner) {
            p.split("").forEach(function(s) {
              app.squares[s].win = true;
            })
          }
        });

      });

      return winner;

    },
    checkDraw: function() {

      var played = 0;
      Object.keys(app.squares).forEach(function(s) {
        if (app.squares[s].o || app.squares[s].x) {
          played++;
        }
      });

      return (played === 9);

    },
    getCombinations: function(chars) {
      var result = [];
      var f = function(prefix, chars) {
        for (var i = 0; i < chars.length; i++) {
          result.push(prefix + chars[i]);
          f(prefix + chars[i], chars.slice(i + 1));
        }
      }
      f('', chars);
      return result.filter(function(x) {
        return x.length == 3
      });
    },
    reset: function() {
      sns.send({gameID: app.gameID}, {action: "reset"})
    },
    cancel: function() {
      sns.send({gameID: app.gameID}, {action: "cancel"})
    },
    getAvailablePlayer: function(id) {
      
      // create our URL
      var url = "/game/" + app.gameID + "/register/" + encodeURIComponent(id);

      // make the call
      this.$http.post(url)
      
      // success
      .then(function(res) {
        sns.send({gameID: app.gameID}, { action: "playersync", data: res.data })
      })

    },
    whoAmI: function(id) {

      if (app.players.o === id) {
        app.me = "o";
      }

      if (app.players.x === id) {
        app.me = "x";
      }

    },
    quit: function(id) {

      // create our URL
      var url = "/game/" + app.gameID + "/remove/" + encodeURIComponent(id);

      // make the call
      this.$http.delete(url)
      
      // success
      .then(function(res) {
        sns.send({gameID: app.gameID}, { action: "playersync", data: res.data });
        $('#playerLeft').modal('show');
        app.turn = "o";
      })

    }
  }
  
});