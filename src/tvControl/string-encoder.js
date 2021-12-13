const { KEYS } = require("samsung-tv-control/lib/keys");

const NFLIX_KBOARD = [
    [" "],
    ["a","b","c","d","e","f"],
    ["g","h","i","j","k","l"],
    ["m","n","o","p","q","r"],
    ["s","t","u","v","w","x"],
    ["y","z","1","2","3","4"],
    ["5","6","7","8","9","0"],
];

let INITIAL_POS = {row: 1, column:0};

function movesToKeySequence(startingPos, horizMoves, vertMoves) {
    let sequence = [];
    let horizKey = horizMoves > 0 ? KEYS.KEY_RIGHT : KEYS.KEY_LEFT;
    let vertKey = vertMoves > 0 ? KEYS.KEY_DOWN : KEYS.KEY_UP;
    
    // TODO: ensure we don't navigate passed bounds of any row or column. Particularly watch out for
    //        row 0, which only has "space" and "delete".

    // NO Horizontal scrolling allowe don row 0
    
    if (startingPos.row == 0) {
        // we're currently on row 0. Execute vertical moves first
        for (let i=0; i<Math.abs(vertMoves); i++) {
            sequence.push(vertKey);
        }
        for (let i=0; i<Math.abs(horizMoves); i++) {
            sequence.push(horizKey);
        }
    }
    else {
        // we're currently NOT on row 0. Execute horiziontal moves first
        for (let i=0; i<Math.abs(horizMoves); i++) {
            sequence.push(horizKey);
        }
        for (let i=0; i<Math.abs(vertMoves); i++) {
            sequence.push(vertKey);
        }
    }

    sequence.push(KEYS.KEY_ENTER);

    return sequence;
}

function getNextSteps(curr, desired) {
    let nextSteps = [];
    let found = false;
    let horizMoves = 0;
    let vertMoves = 0;
    let newPos = {row: curr.row, column: curr.column};

    let startingColumn = curr.column;
    for (let i=curr.row; i>=0; i--) {
        for (let j=startingColumn; j>=0; j--) {
            if (NFLIX_KBOARD[i][j] == desired) {
                horizMoves = j - curr.column;
                vertMoves = i-curr.row;
                newPos.row = i;
                newPos.column = j;
                found = true;
                break;
            }
        }

        if (i > 0) {
            startingColumn = NFLIX_KBOARD[i-1].length - 1;
        }
    }

    console.log(horizMoves)
    console.log(vertMoves)

    if (found) {
        return {
            sequence: movesToKeySequence(curr, horizMoves, vertMoves),
            newPos
        }
    }

    let bottomRowIdx = NFLIX_KBOARD.length - 1;
    startingColumn = curr.column;

    for (let i=curr.row; i<NFLIX_KBOARD.length; i++) {
        for (let j=startingColumn; j<NFLIX_KBOARD[bottomRowIdx].length; j++) {
            if (NFLIX_KBOARD[i][j] == desired) {
                horizMoves = j - curr.column;
                vertMoves = i - curr.row;
                newPos.row = i;
                newPos.column = j;
                found = true;
                break;
            }
        }

        startingColumn = 0;
    }

    if (found) {
        return {
            sequence: movesToKeySequence(curr, horizMoves, vertMoves),
            newPos
        }
    }

    console.log("Key not found: " + desired);
    return {
        newPos,
        sequence: []
    };
}

/**
 * 
 * @param {*} str string to encode in controller moves
 * @param {*} resetPosCount position will be reset to a known value every `resetPosCount` number of characters
 *             specify 0 to never reset. 1 will reset to known position after every character.         
 * @param {*} playFirstSuggestion append final sequence of keys to navigate to first suggestion and play it
 */
function encodeString(str, resetPosCount=0, playFirstSuggestion=true) {
    let currPosition = {...INITIAL_POS};
    let encoding = [];
    for (let i=0; i<str.length; i++) {
        let newChar = str[i];

        let nextStepsInfo = getNextSteps(currPosition, newChar);

        currPosition = {...nextStepsInfo.newPos};

        encoding.push(...nextStepsInfo.sequence);

        if (resetPosCount && i % resetPosCount == 0) {

            encoding.push(...[KEYS.KEY_RETURN, KEYS.KEY_RETURN])
            currPosition = {...INITIAL_POS};
        }
    }

    if (playFirstSuggestion) {
        // calculate horizontal moves needed to nav to first suggestion
        encoding.push(...movesToKeySequence(currPosition, 6 - currPosition.column, 0));
        encoding.push(KEYS.KEY_ENTER); // one more enter to start playing right away from the Media INFO screen
    }

    // console.log(encoding)

    return encoding;
}

module.exports = {
    encodeString
}

// console.log(encodeString("oceans13"))