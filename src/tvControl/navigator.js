const { KEYS } = require("samsung-tv-control/lib/keys");

class NavNetflix {

    navToMainMenu() {
        let sequence = [];

        // ENTER twice to make sure we've selected a Profile and viewing something in the main UI
        sequence.push(KEYS.KEY_ENTER);
        sequence.push(KEYS.KEY_ENTER);

        // Back 10 times to make sure we're either on the home page or viewing the menu on the home page
        for (let i=0; i<10; i++) {
            sequence.push(KEYS.KEY_RETURN);
        }

        // Left 3 times to make sure we're viewing the menu on the home page
        for (let i=0; i<3; i++) {
            sequence.push(KEYS.KEY_LEFT);
        }

        // Up 5 times to make sure we're at the top item
        for (let i=0; i<5; i++) {
            sequence.push(KEYS.KEY_UP);
        }

        return sequence;
    }

    navToHomeScreen() {
        // unused right now
        // this.navToMainMenu();

        // Right (or back) 1 time
    }

    goToSearch() {
        let sequence = [];

        sequence.push(...this.navToMainMenu());

        // Down 2 times to get to search
        sequence.push(...[KEYS.KEY_DOWN, KEYS.KEY_DOWN]);

        // Enter 1 time to open search
        sequence.push(KEYS.KEY_ENTER);
        
        return sequence;
    }

    
}

module.exports = {
    NavNetflix
}
