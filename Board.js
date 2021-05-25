var helper = require('./helper.js');
var info = require('./info.json');

class Board {
    
    constructor(boardSize) {
        this.bs = boardSize;
        this.grid = new Array(boardSize);
        
        for(var i = 0; i < boardSize; i++) {
            this.grid[i] = new Array(boardSize).fill(0);
        }
        
        this.turn = 1;
    }
    
    checkWinningStatus(type) {
        var visited = new Array(this.bs*this.bs, false);
        
        var cells = []; //"stack"
        
        // Add all possible start positions to the stack
        for(var i = 0; i < this.bs; i++)
        {
            // type 1 is vertical, so row = 0, type -1 is horizontal, so col = 0
            var c = (type == 1 ? i : i*this.bs);
            var rc = this.getRC(c);
            if(this.grid[rc[0]][rc[1]] == type)
            {
                cells.push(c);
                visited[c] = true;
            }
        }

        // search time!
        while(cells.length != 0)
        {
            // Take the first cell off the stack
            var c = cells.pop();
            var rc = this.getRC(c);
            
            // Check if it meets the goal state (other side of the board)
            if(type == 1 ? rc[0] == this.bs-1 : rc[1] == this.bs-1) {
                return true;
            }

            // Add unvisited neighbours
            for(var m = 1; m <= 7; m++) {
                var dr = Math.floor(m/3) -1, dc = m%3 -1;
                var i = this.getInd(rc[0]+dr, rc[1]+dc);
                if(m != 4 && !this.outOfBounds(rc[0]+dr, rc[1]+dc) && this.grid[rc[0]+dr][rc[1]+dc] == type && !visited[i]) {
                    cells.push(i);
                    visited[i] = true;
                }
            }
        }

        return false;
    }
    
    addMove(type, row, col) {
        if(type != this.turn) return false;
        if(this.grid[row][col] != 0) return false;
        
        this.grid[row][col] = type;
        this.turn *= -1;
        
        return true;
    }
    
    removeMove(row, col) {
        if(this.grid[row][col] == 0) return false;
        
        this.grid[row][col] = 0;
        this.turn *= -1;
        // TODO status = 0?
        
        return true;
    }
    
    static isMove(move) {
        if(move.length < 2 || move.length > 3) return false;
        var row = move.substring(1, 3);
        
        if(!helper.isNormalInteger(row)) return false;
        
        return true;
    }
    
    getCoordsFromMove(move) {
        if(!Board.isMove(move)) return false;
        
        var col = move[0].charCodeAt(0)-'A'.charCodeAt(0);
        var row = move.substring(1, 3);
        if(this.outOfBounds(parseInt(row-1), col)) return false;
        
        return [parseInt(row-1), col];
    }
    
    validInput(row, col) {
        return !this.outOfBounds(row, col) && this.grid[row][col] == 0;
    }
    
    outOfBounds(row, col) {
        return row < 0 || col < 0 || row >= this.bs || col >= this.bs;
    }
    
    getBoardAsString() {
        var o = "     ";
        
        // Letters along the top
        for(var i = 65; i < 65+this.bs; i++) {
            o += String.fromCharCode(i) + "   ";
        }
        o += "\n";
        
        // Line under the top letters
        o += "   ";
        for(var i = 0; i < this.bs; i++) {
            o += "----";
        }
        o += "\n";
        
        // Grid
        for(var i = 0; i < this.bs; i++) {
            // Spacing to the left of the rows
            for(var k = 0; k < i; k++)  o += "  ";
            
            // Number on the left
            if(i < 9) o += " ";
            o += (i+1) + " ";
            
            // Rows
            for(var j = 0; j < this.bs; j++) {
                var cellMap = ['B', ' ', 'R'];
                if(j == 0) o += "|";
                o += " " + cellMap[this.grid[i][j] + 1] + " |";
            }
            
            o += "\n";
        }
        
        // Spacing before the bottom line
        for (var k = 0; k <= this.bs; k++) o += "  ";

        // The bottom line
    	for (var j = 0; j < this.bs; j++) o += "----";
        
        o += "\n\n";
        
        return o;
    }
    
    getGrid(row, col) { return this.grid[row][col]; }
    getBoardSize() { return this.bs; }
    getTurn() { return this.turn; }
    getRC(c) { return [Math.floor(c/this.bs), c%this.bs]; }
    getInd(r, c) { return r*this.bs + c; }
}

module.exports = Board;