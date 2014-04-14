/*jslint devel: true, eqeq: true, plusplus: true, sloppy: true, white: true */

//Console.log statements are all stand-ins for unit testing. Brigitte intends to hook 
//this up to jasmine and replace all commented out console.logs with tests. 

var game = {};

//The board sub-object manages the location of cells, their size, how many there are, and 
//what their status is. Board does not draw cells. Board does not know what cells look like. 
//Board does not care about framerate, or pretty much anything other than "create the cell 
//object. find the cell object. reference and update the cell object.
game.board = {
    width: 7,
    height: 4,
    totalSlots: 0,
    currentPieces: [],
    cellWidth: 0,
    cellHeight: 0,
    normalX: 0,
    normalY: 0,
    //Create an array of cell objects. 
    createPieces: function () {
        var i;
        this.totalSlots = this.width * this.height;
        this.cellWidth = game.width / this.width;
        this.cellHeight = game.height / this.height;        
        this.normalX = $("#game-canvas").offset().left;
        this.normalY = $("#game-canvas").offset().top;
        //Create a new cell object for each slot in the array.
        for (i = 0; i < this.totalSlots; i++) {
            this.currentPieces.push(new Cell());
        }
        //Log out the array.  Replace this with a unit test later. 
        //console.log(this.currentPieces);
    },
    //Sets a cell's status to alive based on it's coordinates.
    triggerCell: function (x, y) {
        //Cell position in the array is "left to right, with wrapping", like typical text. 
        //A cell's position is the number of places per row times which row it's in, plus which column it's in. 
        this.getCell(x, y).setStatus(true);
    },
    //Sets a cell's status to alive based on it's coordinates.
    toggleCell: function (x, y) {
        //Cell position in the array is "left to right, with wrapping", like typical text. 
        //A cell's position is the number of places per row times which row it's in, plus which column it's in. 
        this.getCell(x, y).toggleStatus(true);
    },
    //Returns a cell referencebased on it's coordinates.
    getCell: function (x, y) {
        var arrayPosition = this.width * y;
        if (this.height > y && y >= 0 && this.width > x && x >= 0) {
            arrayPosition += x;
            //console.log("Found cell at " + x + "x" + y + " (" + arrayPosition + "): " +                     game.board.currentPieces[arrayPosition]);
            return game.board.currentPieces[arrayPosition];
        } else {
            //console.log("Cell " + x + "x" + y + " was in a negative row or column.");
            return undefined;
        }
    },
    //Returns the status of neighbor cells in an array.
    getNeighborStatuses: function (x, y) {
        var statusList = [],
            teamList = [],
            neighborList = [],
            neighbor,
            searchSlots = [];
        neighborList.push(game.board.getCell(x - 1, y - 1));
        neighborList.push(game.board.getCell(x, y - 1));
        neighborList.push(game.board.getCell(x + 1, y - 1));
        neighborList.push(game.board.getCell(x - 1, y));
        neighborList.push(game.board.getCell(x + 1, y));
        neighborList.push(game.board.getCell(x - 1, y + 1));
        neighborList.push(game.board.getCell(x, y + 1));
        neighborList.push(game.board.getCell(x + 1, y + 1));
        for(neighbor = 0; neighbor < neighborList.length; neighbor++) {
            if (neighborList[neighbor] != undefined) {
                statusList.push(neighborList[neighbor].getStatus());
                teamList.push(neighborList[neighbor].getTeam());
            }   
        }
        return [statusList, teamList];
    },
    //Updates the status of cells based on their neighbors. 
    updatePieces: function () {        
        var i,
            j,
            currentRow = 0,
            currentColumn = 0,
            currentNeighbors,
            liveNeighbors,
            neighborTeams = [],
            neighborTeamCounts = [],
            newStatuses = [],
            newPlayers = [];
        for (i = 0; i < this.totalSlots; i++) {
            //console.log("Checking row [" + currentRow + "] against width [" + game.board.width + "].");
            if (currentRow >= game.board.width) {
                //Increment the row and reset column to 0
                currentColumn++;
                currentRow = 0;
            }
            //console.log("Get neighbors for " + currentRow + ", " + currentColumn);
            currentNeighbors = this.getNeighborStatuses(currentRow, currentColumn);
            //console.log(currentNeighbors);
            liveNeighbors = 0;
            neighborTeams = [];
            neighborTeamCounts = [];
            for (j = 0; j < currentNeighbors[0].length; j++) {
                if (currentNeighbors[0][j] == true) {
                    liveNeighbors++;
                    //console.log("only check live cells.");
                    //console.log("Check team next: " + currentNeighbors[1][j]);
                    if(neighborTeams.indexOf(currentNeighbors[1][j]) < 0) {
                      //console.log("Team was not in neighborTeams array.");
                        neighborTeams.push(currentNeighbors[1][j]);
                        neighborTeamCounts.push(1);
                    } else {
                       // console.log("Team was in neighbor teams array.");
                        neighborTeamCounts[neighborTeams.indexOf(currentNeighbors[1][j])]++;
                    }
                }
            }
            //console.log(neighborTeams + ", totalling " + neighborTeamCounts);
            
//            console.log("CURRENT STATUS: " + game.board.currentPieces[i].getStatus() + " and TOTAL LIVE NEIGHBORS: " + liveNeighbors);
            if (game.board.currentPieces[i].getStatus() == true) {
                if (liveNeighbors >= 2 && liveNeighbors <= 3) {
                    //Replace this with a test!
                  //  console.log("CURRENT STATUS: " + game.board.currentPieces[i].getStatus() + " and TOTAL LIVE NEIGHBORS: " + liveNeighbors);
                    newStatuses.push(true);
                    if(neighborTeamCounts[0] > neighborTeamCounts[1] || neighborTeams.length == 1) {
                        newPlayers.push(neighborTeams[0]);
                    } else {
                        newPlayers.push(neighborTeams[1]);
                    }
                } else {
                    newStatuses.push(false);
                    newPlayers.push(game.board.currentPieces[i].getTeam());
                }
            } else if (liveNeighbors == 3) {
                newStatuses.push(true);
                if(neighborTeamCounts[0] > neighborTeamCounts[1] || neighborTeams.length == 1) {
                    newPlayers.push(neighborTeams[0]);
                } else {
                    newPlayers.push(neighborTeams[1]);
                }
            } else {
                newStatuses.push(false);
                newPlayers.push(game.board.currentPieces[i].getTeam());
            }
            currentRow++;
        }
        //console.log("newStatuses are: " + newStatuses);        
        for (i = 0; i < this.totalSlots; i++) {
            this.currentPieces[i].setStatus(newStatuses[i]); 
            this.currentPieces[i].setTeam(newPlayers[i]);
        }
    },
    //Toggle the status of the cell under the mouse, and set a team or player name.
    //Left click sets the team to "playerLeft".
    //Right click sets the team to "playerRight".
    //Redraws the board.
    toggleCellByMouse: function (event) {
        var normalizedX = event.pageX - game.board.normalX,
            normalizedY = event.pageY - game.board.normalY,
            playerName = "playerLeft";
        game.board.toggleCell(parseInt(normalizedX / game.board.cellWidth), parseInt(normalizedY / game.board.cellHeight));
        if( event.button == 2 ) {
            playerName = "playerRight";
        }
        game.board.getCell(parseInt(normalizedX / game.board.cellWidth), parseInt(normalizedY / game.board.cellHeight)).setTeam(playerName);
        game.drawBoard();    
        //Use the console statements below to create tests later. 
        //console.log("clicked the board at " + event.pageX + "x" + event.pageY + " !");
        //console.log("x is normalized by " + normalX + ", which is " + normalizedX);
        //console.log("y is normalized by " + normalY + ", which is " + normalizedY);
        //console.log("expect cells to be " + game.board.cellWidth + "wide.");
        //console.log("expect cells to be " + game.board.cellHeight + "high.");
        //console.log("Cell is probably number " + parseInt(normalizedX / game.board.cellWidth) + "x.");
        //console.log("Cell is probably number " + parseInt(normalizedY / game.board.cellHeight) + "y.");
    }
};




game.start = function () {
    game.playing = true;
    $("#stopBtn").bind("click", function () {
        game.playing = false;
    });
    $("#startBtn").bind("click", function () {
        game.playing = true;
        game.frame();
    });
    $("#game-canvas").css("border", "#666 solid 1px");
    $("#game-canvas").bind("mousedown ", game.board.toggleCellByMouse);
    $("#game-canvas").bind("contextmenu", function () {
        return false;
    });
    
    game.width = $("#game-canvas").width();
    game.height = $("#game-canvas").height();
    game.x = $("game-canvas").x;
    game.y = $("game-canvas").y;
    game.liveColor = "#0000ff";
    game.deadColor = "#efefff";
    game.startColor = "fdfdfd";
    game.outlineColor = "#666666";
    game.players = {
        playerRight: {
            name: "playerRight's display name!",
            liveColor: "#ff0000",
            deadColor: "#ffefef"
        },
        playerLeft: {
            name: "playerLeft's display name!",
            liveColor: "#0000ff",
            deadColor: "#efefff"
        }           
    }
    
    game.board.width = game.width / 10;
    game.board.height = game.height / 10;
    
    
    game.board.createPieces();
    //game.board.triggerCell(15, 15);
    //game.board.triggerCell(16, 15);
    //game.board.triggerCell(17, 15);
    //game.board.triggerCell(16, 17);
    //game.board.triggerCell(17, 16);
    //game.board.triggerCell(14, 16);
    
    
    var canvas = document.getElementById("game-canvas"),
        ctx;
    if (canvas.getContext) {
        ctx = canvas.getContext("2d");
		ctx.clearRect(0, 0, 500, 500);
        ctx.strokeStyle = "#666666";
        ctx.lineWidth = 0;
        
          
        game.drawBoard = function () {
            var i,
                cellWidth = game.width / Number(game.board.width),
                cellHeight = game.height / Number(game.board.height),
                currentColumn = 0,
                currentRow = 0,
                currentPieceTeam;
            
           // console.log("draw cells as " + cellWidth + " by " + cellHeight);
            
            for (i = 0; i < game.board.totalSlots; i++) {
                //console.log(i + ": " + i % game.board.height + " of " + game.board.height);
                if (currentColumn >= game.board.width) {
                    //Increment the row and reset column to 0;
                    currentRow++;
                    ctx.fillStyle = game.outlineColor;
                    ctx.fillRect(0, cellHeight * currentRow - 1, game.width, 1);
                    currentColumn = 0;
                }
                if (currentRow == game.board.height - 1) {
                    ctx.fillStyle = game.outlineColor;
                    ctx.fillRect(cellWidth * currentColumn - 1, 0, 1, game.height);
                }
                    
                currentPieceTeam = game.board.currentPieces[i].getTeam();
                if (game.board.currentPieces[i].getStatus()) {
                    if(game.players[currentPieceTeam]) {
                        ctx.fillStyle  = game.players[currentPieceTeam].liveColor;
                    } else {
                        ctx.fillStyle = game.liveColor;
                    }
                } else if (game.board.currentPieces[i].getPast()) {
                    ctx.fillStyle = game.deadColor;
                    if(game.players[currentPieceTeam]) {
                        ctx.fillStyle = game.players[currentPieceTeam].deadColor;
                    } else {
                        ctx.fillStyle = game.deadColor;
                    }                        
                } else {
                    ctx.fillStyle = game.startColor;
                }
                //Draw the cell:
                ctx.fillRect(cellWidth * currentColumn, cellHeight * currentRow, cellWidth, cellHeight);
                //Outline the cell:
                ctx.rect(cellWidth * currentColumn, cellHeight * currentRow, cellWidth, cellHeight);
                //Just stroke the bottom and right sides of the cell:
                //ctx.moveTo(cellWidth * currentColumn, cellHeight * currentRow + cellHeight);
                //ctx.lineTo(cellWidth * currentColumn + cellWidth, cellHeight * currentRow + cellHeight);
                //ctx.lineTo(cellWidth * currentColumn + cellWidth, cellHeight * currentRow);
                //ctx.stroke();
                currentColumn++;
            }
        };
        
        game.drawBoard();
        
        game.frame = function () {
            setTimeout(function () {
                if (game.playing == true) {
                    game.board.updatePieces();
                    game.drawBoard();
                    game.frame();
                }
            }, 250);
        };
        
       // game.frame();
          
    } else {
          console.log("No canvas!");
    }
};

game.start();
