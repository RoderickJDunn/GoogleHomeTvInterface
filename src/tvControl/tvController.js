const WebSocket = require("ws");
const Samsung = require("samsung-tv-control").default;
const { KEYS } = require("samsung-tv-control/lib/keys");
let { APPS } = require("samsung-tv-control/lib/apps");
let STR_ECD = require ("./string-encoder");
let helpers = require("./helpers");
let CMD_CHAINER = require("./cmd-chainer");
let {NavNetflix} = require("./navigator");
let {COMMAND_MAP: CMD_MAP, REDUCTION_QUALIFIERS, INCREASE_QUALIFIERS} = require("./cmd-map");
let CFG = require("./configs");

APPS.Plex = "3201512006963";
APPS.DisneyPlus = APPS["Disney+"];
APPS["Disney Plus"] = APPS["Disney+"];

let TV_MAP = {
    1: {
        config: CFG.TV1,
        ctl: new Samsung(CFG.TV1)
    },
    2: {
        config: CFG.TV2,
        ctl: new Samsung(CFG.TV2)
    },
    3: {
        config: CFG.TV3,
        ctl: new Samsung(CFG.TV3)
    },
}

var count = 0;

function sendCommand(tvId, command = "ENTER") {
    console.log(`Got raw command '${command}' for TV ${tvId}`);

    let currTV = TV_MAP[tvId];
    if (!currTV) {
        console.log("ERROR: No TV info found for TV ID: ", tvId);
        return;
    }
    
    let controller = currTV.ctl;

    let rawCommand = command;
    let outCommand = rawCommand;
    let interval = undefined;
    let found = false;
    // check for special cases
    for (k in CMD_MAP) {
        console.log(k);
        if (k == rawCommand) {
            outCommand = CMD_MAP[k];
            found = true;
            break;
        }
    }

    if (found == false) {
        // no exact match found in CMD_MAP. Check for partial match, then look for qualifier words
        for (k in CMD_MAP) {
            console.log(k);
            if (rawCommand.includes(k)) {
                outCommand = CMD_MAP[k];
                let foundQualifier = false;
                if (typeof outCommand != "string") {
                    for (let i=0; i<INCREASE_QUALIFIERS.length; i++) {
                        let q = INCREASE_QUALIFIERS[i];
                        console.log("Checking for qualifier: " + q);
                        if (rawCommand.includes(q)) {
                            console.log("found qualifier: ", q)
                            // found 'more' qualifier. Double the command length
                            outCommand = outCommand.concat(outCommand);
                            foundQualifier = true;
                            break;
                        }
                    }

                    for (let i=0; i<REDUCTION_QUALIFIERS.length; i++) {
                        let q = REDUCTION_QUALIFIERS[i];
                        console.log("Checking for qualifier: " + q);
                        if (rawCommand.includes(q)) {
                            console.log("found qualifier: ", q)
                            // found 'less' qualifier. Half the command length
                            outCommand = outCommand.slice(0, outCommand.length / 2);
                            foundQualifier = true;
                            break;
                        }
                    }

                    // check for numbers (for now only used for rewind/FF, and potentially volume)
                    let matches = rawCommand.match(/\d+/);
                    if (matches) {
                        foundQualifier = true;
                        if (rawCommand.includes("rewind") || rawCommand.includes("fast forward")) {
                            // set time period between pressing 'rewind' and 'play'
                            // probably takes around 300ms per 10sec rewound/ff. So for 30seconds rewind, wait for (30/10 * 500 = 1.5 seconds)
                            interval = (parseInt(matches[0]) / 10) * 300;
                            outCommand = CMD_MAP[k];
                        }

                        if (rawCommand.includes("volume") || rawCommand.includes("up") || rawCommand.includes("down") || rawCommand.includes("softer") || rawCommand.includes("louder")) {
                            let changeBy = parseInt(matches[0]);

                            outCommand = new Array(changeBy);
                            outCommand.fill(CMD_MAP[k]);
                        }

                    }
                }
                found = true;
                break;
            }
        }
    }

    if (found == false) {
        // no exact or partial match found in CMD_MAP. Just replace spaces with _ (underscores)
        outCommand = outCommand.replace(/\s/g, "_");
    }

    if (typeof outCommand == "string") {
        // we have a single Key command
        let key = "KEY_" + outCommand.toUpperCase();
        console.log("Sending key: ", key);
        controller.sendKey(key, function(err, res) {
            if (err) {
                // controller.closeConnection();
                console.log("Error sending key: " + err);
            } else {
                // Get token by uncommenting this.
                console.log("resp: " + JSON.stringify(res));

                // controller.closeConnection();
            }
        });
    }
    else {
        CMD_CHAINER.executeChain(controller, outCommand, interval);
    }
}

function openApp(tvId, name) {
    let currTV = TV_MAP[tvId];

    if (!currTV) {
        console.log("ERROR: No TV info found for TV ID: ", tvId);
        return;
    }
    
    let config = currTV.config;

    // lookup ID from name
    let appId = "";
    for (key in APPS) {
        if (name.toLowerCase() == key.toLowerCase()) {
            appId = APPS[key];
            console.log("Found app ID for " + name);
        }
    }

    if (appId.length == 0) {
        console.log("Error: No app ID found for " + name);
        return;
    }

    const wsUrl = `wss://${config.ip}:${config.port}/api/v2/channels/samsung.remote.control?name=${config.name}&token=${config.token}`;
    const ws = new WebSocket(wsUrl, { rejectUnauthorized: false });

    console.log("opening app: ", name);

    ws.onopen = function() {
        console.log("sending"); 
        ws.send(JSON.stringify(helpers.getMsgLaunch3rdPartyApp(appId)), () => {
            ws.close();
        });
    };
    ws.onmessage = function() {
        console.log("message"); 
        ws.close();
    };
    ws.onerror = function() {
        console.log("error"); 
        ws.close();
    };
}

function playNetflixMedia(tvId, media) {
    let currTV = TV_MAP[tvId];

    if (!currTV) {
        console.log("ERROR: No TV info found for TV ID: ", tvId);
        return;
    }

    let controller = currTV.ctl;

    let navigator = new NavNetflix();
    let navSequence = navigator.goToSearch();
    console.log("navSequence", navSequence)
    let keySequence = STR_ECD.encodeString(media, 6, true);

    navSequence.push(...keySequence)

    CMD_CHAINER.executeChain(controller, navSequence);
}

// console.log("Sending key.");
// sendCommand(3, "down")

// TV_MAP[3].ctl.sendKey(KEYS.KEY_PERPECT_FOCUS, (err, resp) => console.log(r));

// TV_MAP[3].ctl.getToken(r => console.log(r));

// TV_MAP[2].ctl.sendText("friends", (err, err2) => console.log("Resp: ", err, err2));

// TV_MAP[3].ctl.getToken((tk) => console.log(tk));
module.exports = {
    sendCommand,
    openApp,
    playNetflixMedia
};