"use strict"

/*****
	Express and Socket.IO
*****/
const express = require('express');
const app = express();
const cfenv = require('cfenv');
const	appEnv = cfenv.getAppEnv();

/*****
	Bodyparser etc... for POST requests
*****/
const bodyParser = require('body-parser');
const bpJSON = bodyParser.json();
const bpUrlencoded = bodyParser.urlencoded({ extended: true});

/*****
	Other stuff
*****/
const _ = require('underscore');
const games = {} // collection of games
/*****
	API endpoints
*****/

// create a new game
app.post('/game', bpJSON, (req, res) => {

	let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
	let id = _.shuffle(chars).splice(0, 14).join("")

	games[id] = {
		o: null,
		x: null
	}

	return res.send({
		success: true,
		id: id
	});

});

app.post('/game/:id/register/:playerid', bpJSON, (req, res) => {

	if (typeof games[req.params.id] != "object") {
		games[req.params.id] = {
			o: null,
			x: null
		}
	}

	if (games[req.params.id].o && games[req.params.id].x) {
		return res.send(games[req.params.id])
	}

	if (games[req.params.id].o === null) {
		games[req.params.id].o = req.params.playerid;
	}

	else if (games[req.params.id].x === null) {
		games[req.params.id].x = req.params.playerid;
	}

	return res.send(games[req.params.id])

})

app.delete('/game/:id/remove/:playerid', bpJSON, (req, res) => {

	if (typeof games[req.params.id] != "object") {
		return res.send({
			o: null,
			x: null
		})
	}

	if (games[req.params.id].o === req.params.playerid) {
		games[req.params.id].o = null;
	}

	else if (games[req.params.id].x === req.params.playerid) {
		games[req.params.id].x = null;
	}

	return res.send(games[req.params.id])

})

/*****
	FRONT END
*****/

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/game/:id', (req, res) => {
  res.sendFile(__dirname + '/public/game.html');
});

// serve static files from /public
app.use(express.static(__dirname + '/public'));

/*****
	Listening
*****/
app.listen(appEnv.port, ( appEnv.bind == "localhost" ? null : appEnv.bind ), () => {
  console.log(`listening on ${appEnv.url || publicIP}`);
});