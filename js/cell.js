/*jslint devel: true, eqeq: true, plusplus: true, sloppy: true, white: true */

//A cell can be alive or dead, and will eventually have more properties.
var Cell = function () {
    var isAlive = false,
        wasAlive = false,
        team = "default";
    
    //Triggering a cell's dead or alive status is the most important part. 
    this.setStatus = function (alive) {
        isAlive = alive;
        if (alive == true) {
            wasAlive = true;
        }
    };
    this.getStatus = function () {
        return isAlive;
    };
    //This is helpful for user interaction - Brigitte decided that it was simpler to
    //let the cell toggle it's own status on click than to have the game and/or board 
    //query, decide, and then set. 
    this.toggleStatus = function () {
        if (isAlive == true) {
            isAlive = false;
        } else {
            isAlive = true;
        }
    };
    
    //Cells which are "dead" now but were alive at one point might later be "woken up" 
    //by the board under certain circumstances.
    //More important, Brigitte wanted to show previously "alive" cells in their own fun 
    //colors to create a more interesting board.
    this.getPast = function () {
        return wasAlive;
    };
    this.setPast = function (past) {
        wasAlive = past;
    };
    
    //The fun expansion of "see which player's color takes over" relies on being able to
    //assign each cell as related to a player. 
    this.getTeam = function () {
        return team;
    };
    this.setTeam = function (teamName) {
        team = teamName;
    };
};
