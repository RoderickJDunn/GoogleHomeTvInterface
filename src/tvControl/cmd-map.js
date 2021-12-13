// Maps raw strings (delivered in URLs) to KEYS, or in some cases, sequences of keys
// Many strings map to keys commands 1:1, but this file specifies some special cases.
const { KEYS } = require("samsung-tv-control/lib/keys");

const LOUDER_SEQUENCE = new Array(5).fill(KEYS.KEY_VOLUP)
const QUIETER_SEQUENCE = new Array(5).fill(KEYS.KEY_VOLDOWN)

const COMMAND_MAP = {
    "power off": KEYS.KEY_POWER.slice(4),
    "power up": KEYS.KEY_POWER.slice(4),
    "turn off": KEYS.KEY_POWER.slice(4),
    "power on": KEYS.KEY_POWER.slice(4),
    "power down": KEYS.KEY_POWER.slice(4),
    "turn on": KEYS.KEY_POWER.slice(4),
    "back": KEYS.KEY_RETURN.slice(4),
    "go back": KEYS.KEY_RETURN.slice(4),
    "picture mode": KEYS.KEY_PMODE.slice(4),
    "p mode": KEYS.KEY_PMODE.slice(4),
    "pee mode": KEYS.KEY_PMODE.slice(4),
    "louder": LOUDER_SEQUENCE,
    "turn up": LOUDER_SEQUENCE,
    "volume up": LOUDER_SEQUENCE,
    "softer": QUIETER_SEQUENCE,
    "quieter": QUIETER_SEQUENCE,
    "turn down": QUIETER_SEQUENCE,
    "volume down": QUIETER_SEQUENCE,
    "rewind by": [KEYS.KEY_REWIND, KEYS.KEY_PLAY],
    "rewind": [KEYS.KEY_REWIND, KEYS.KEY_PLAY],
    "fast forward": [KEYS.KEY_FF, KEYS.KEY_PLAY],
    "fast forward by": [KEYS.KEY_FF, KEYS.KEY_PLAY],
    "darker": [KEYS.KEY_PMODE, KEYS.KEY_DOWN, KEYS.KEY_DOWN, KEYS.KEY_ENTER],
    "brighter": [KEYS.KEY_PMODE, KEYS.KEY_UP, KEYS.KEY_UP, KEYS.KEY_ENTER]
}

const INCREASE_QUALIFIERS = [
    "a lot",
    "much",
    "very",
    "way"
]


const REDUCTION_QUALIFIERS = [
    "a little",
    "little",
    "bit",
    "a bit",
]

module.exports = {
    COMMAND_MAP,
    INCREASE_QUALIFIERS,
    REDUCTION_QUALIFIERS
}