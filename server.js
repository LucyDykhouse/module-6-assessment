const express = require('express');
const path = require('path');
const app = express();
const {bots, playerRecord} = require('./data');
const {shuffleArray} = require('./utils');
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
    accessToken: '337464f032bd4171b94b4dc9aa583c9f',
    captureUncaught: true,
    captureUnhandledRejections: true
});

app.use(express.json());
app.use(express.static("public"));

app.get("/styles", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.css"));
  });

app.get("/js", (req, res) => {
    rollbar.info('Index.js file served successfully')
    res.sendFile(path.join(__dirname, "public/index.js"));
});

app.get('/api/robots', (req, res) => {
    try {
        res.status(200).send(botsArr)
    } catch (error) {
        console.log('ERROR GETTING BOTS', error)
        rollbar.error('There was an error retrieving the bots')
        res.sendStatus(400)
    }
})

app.get('/api/robots/five', (req, res) => {
    try {
        let shuffled = shuffleArray(bots)
        let choices = shuffled.slice(0, 5)
        let compDuo = shuffled.slice(6, 8)
        rollbar.info('Five robot choices displayed to user')
        res.status(200).send({choices, compDuo})
    } catch (error) {
        console.log('ERROR GETTING FIVE BOTS', error)
        rollbar.error('There was an error retrieving the bot choices for the user')
        res.sendStatus(400)
    }
})

app.post('/api/duel', (req, res) => {
    try {
        // getting the duos from the front end
        let {compDuo, playerDuo} = req.body

        // adding up the computer player's total health and attack damage
        let compHealth = compDuo[0].health + compDuo[1].health
        let compAttack = compDuo[0].attacks[0].damage + compDuo[0].attacks[1].damage + compDuo[1].attacks[0].damage + compDuo[1].attacks[1].damage
        
        // adding up the player's total health and attack damage
        let playerHealth = playerDuo[0].health + playerDuo[1].health
        let playerAttack = playerDuo[0].attacks[0].damage + playerDuo[0].attacks[1].damage + playerDuo[1].attacks[0].damage + playerDuo[1].attacks[1].damage
        
        // calculating how much health is left after the attacks on each other
        let compHealthAfterAttack = compHealth - playerAttack
        let playerHealthAfterAttack = playerHealth - compAttack

        // comparing the total health to determine a winner
        if (compHealthAfterAttack > playerHealthAfterAttack) {
            playerRecord.losses++
            rollbar.info('Duel successful. The user lost')
            res.status(200).send('You lost!')
        } else {
            playerRecord.losses++
            rollbar.info('Duel successful. The user won')
            res.status(200).send('You won!')
        }
    } catch (error) {
        console.log('ERROR DUELING', error)
        rollbar.error('There was an error playing the duel')
        res.sendStatus(400)
    }
})

app.get('/api/player', (req, res) => {
    try {
        rollbar.info('User\'s record updated')
        res.status(200).send(playerRecord)
    } catch (error) {
        console.log('ERROR GETTING PLAYER STATS', error)
        rollbar.error('There was an error updating the user\'s record')
        res.sendStatus(400)
    }
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})