
const { KEYS } = require("samsung-tv-control/lib/keys");

function isKeySlow(key) {
    return key == KEYS.KEY_ENTER || key == KEYS.KEY_PMODE || key == KEYS.KEY_HOME;
}

function executeStep(ctl, sequence, currIdx, interval, longKeyInterval) {
    console.log("Sending key: ", sequence[currIdx]);

    ctl.sendKey(sequence[currIdx], function(err, res) {
        if (err) {
            // ctl.closeConnection();
            console.log("Error sending key: " + err);
        } else {
            console.log("--> Successful send");
            // ctl.closeConnection();
        }
    });
    if (currIdx+1 < sequence.length) {
        let currInterval = interval;
        if (isKeySlow(sequence[currIdx])) {
            currInterval = longKeyInterval;
        }
        console.log("currKey | currInterval", sequence[currIdx], currInterval)
        setTimeout(() => {
            executeStep(ctl, sequence, currIdx+1, interval, longKeyInterval)
        }, currInterval);
    }
}

/* Executes a sequence of commands with the specified timing intervals between them */
function executeChain(controller, sequence, interval=500, longKeyInterval=1200) {
    console.log("Got sequence: ", sequence);
    controller
    // Get token for API
    let currInterval = interval;
    if (isKeySlow(sequence[0])) {
        currInterval = longKeyInterval;
    }
    setTimeout(() => {
        executeStep(controller, sequence, 0, interval, longKeyInterval)
    }, currInterval);
        
}

module.exports = {
    executeChain
}