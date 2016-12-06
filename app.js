"use strict"

/*****
	Express and environment
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

	// create an ID of 14 random chars
	let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
	let id = _.shuffle(chars).splice(0, 14).join("")

	// create game object
	games[id] = {
		o: null,
		x: null
	}

	return res.send({
		success: true,
		id: id
	});

});

// register a player in a game
app.post('/game/:id/register/:playerid', bpJSON, (req, res) => {

	// make sure we have this game object
	// create if not there
	if (typeof games[req.params.id] != "object") {
		games[req.params.id] = {
			o: null,
			x: null
		}
	}

	// if both players are assigned, return game object
	if (games[req.params.id].o && games[req.params.id].x) {
		return res.send(games[req.params.id])
	}

	// if o is not assigned, assign this player
	if (games[req.params.id].o === null) {
		games[req.params.id].o = req.params.playerid;
	}

	// else, if x is not assigned, assign this player
	else if (games[req.params.id].x === null) {
		games[req.params.id].x = req.params.playerid;
	}

	// return game object
	return res.send(games[req.params.id])

});

// remove player from game
app.delete('/game/:id/remove/:playerid', bpJSON, (req, res) => {

	// if this game does not exist, then return empty game object
	if (typeof games[req.params.id] != "object") {
		return res.send({
			o: null,
			x: null
		})
	}

	// if this player is assigned to o, remove
	if (games[req.params.id].o === req.params.playerid) {
		games[req.params.id].o = null;
	}

	// else if assigned to x, remove
	else if (games[req.params.id].x === req.params.playerid) {
		games[req.params.id].x = null;
	}

	// return game object
	return res.send(games[req.params.id])

})

/*****
	FRONT END
*****/

// homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// game page
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