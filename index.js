const express = require('express')
const app = express()
const port = 80
let TvCtl = require("./src/tvControl/tvController");
let lastTvId = 2;


app.get('/', (req, res) => res.send('Hello World!'))
app.get('/tv/:id/sendKey/:command', (req, res) => {
    console.log("Incoming sendCmd request. Raw: ", req.params);
    lastTvId = req.params.id;
    TvCtl.sendCommand(req.params.id, req.params.command);
    res.send('done!');
})
app.get('/tv/sendKey/:command', (req, res) => {
    console.log("Incoming sendCmd request. Raw: ", req.params);

    let command = req.params.command;

    // handle special case where google recognized "TV 2" as "TV too" or "TV to"
    if (command.startsWith("too") || command.startsWith("to")) {
        lastTvId = 2;
        // remove the "too" or "to" from the command
        command = command.split(" ").splice(1).join(" ");
    }
    else if (command.startsWith("number too") || command.startsWith("number to")) {
        lastTvId = 2;
        // remove the "too" or "to" from the command
        command = command.split(" ").splice(2).join(" ");
    }

    TvCtl.sendCommand(lastTvId, command);
    res.send('done!');
})
app.get('/tv/:id/app/:name', (req, res) => {
    console.log("Incoming 'OpenApp' request");
    lastTvId = req.params.id;
    TvCtl.openApp(req.params.id, req.params.name);
    res.send('done!');
})
app.get('/tv/app/:name', (req, res) => {
    console.log("Incoming 'OpenApp' request");
    TvCtl.openApp(lastTvId, req.params.name);
    res.send('done!');
})
app.get('/tv/:id/system/:command', (req, res) => {
    // system request commands: OFF, ON (unsupported), UP, DOWN
    console.log("Incoming system request");
    TvCtl.controlTv(req.params.command);
    res.send('done!');
})
app.get('/tv/system/:command', (req, res) => {
    // system request commands: OFF, ON (unsupported), UP, DOWN
    console.log("Incoming system request");
    TvCtl.controlTv(req.params.command);
    res.send('done!');
})
app.get('/tv/netflix/play/:media', (req, res) => {
    // searches for `media` and plays the top result
    console.log("Incoming play media request");
    TvCtl.playNetflixMedia(lastTvId, req.params.media);
    res.send('done!');
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))