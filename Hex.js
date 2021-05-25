var helper = require('./helper.js');
var info = require('./info.json');
const Board = require('./Board.js');
const Discord = require('discord.js');
const HexGameHandler = require('./HexGameHandler.js');

class Hex {
    
    constructor(channel, boardSize, player1, player2) {
        this.channel = channel;
        this.board = new Board(boardSize);
        this.players = [player1.id, player2.id];
        this.names = [player1.username, player2.username];
        this.moveList = [];
        this.coordList = [];
        this.over = false;
    }
    
    start() {
        this.channel.send(this.getOutput(false));
    }
    
    play(message) {
        var moves = this.board.getCoordsFromMove(message.content);
        var type = this.getTypeFromUser(message.author);
        if(moves === false || type === false) {
            // do nothing
        } else if(type != this.board.getTurn()) {
            this.channel.send("It's not your move.");
        } else if(this.board.addMove(type, moves[0], moves[1])) { // success
            var win = this.board.checkWinningStatus(type);
            this.moveList.push(message.content.toUpperCase());
            this.coordList.push(moves);
            this.channel.send(this.getOutput(win));
            
            if(win) {
                this.over = true;
            }
        } else {
            this.channel.send("Invalid move.");
        }
        
    }
    
    getOutput(win) {
        var o = "```---- "  + this.names[0] + ' (R) VS. ' + this.names[1] + ' (B) ----\n\n';
        var i = (this.board.getTurn() * -1 == 1 ? 0 : 1);
        
        if(this.moveList.length != 0) {
            o += this.names[i] + " plays " + this.moveList[this.moveList.length-1] + "!\n";
        }
        
        o += this.board.getBoardAsString() + "\n";
        var u = (this.board.getTurn()  == 1 ? 0 : 1);
        if(!win) o += "It is " + this.names[u] + "'s turn.```";
        else o += this.names[i] + " has WON the game!!```";
        
        return o;
    }
    
    undo(user) {
        var t = this.getTypeFromUser(user);
        if(this.board.getTurn() == t) {
            this.channel.send("You cannot undo your opponent's move.");
        } else if(this.moveList.length == 0) {
            this.channel.send("There are no moves to undo.");
        } else {
            var m = this.coordList[this.coordList.length-1];
            this.board.removeMove(m[0], m[1]);
            this.coordList.splice(this.coordList.length-1, 1);
            this.moveList.splice(this.moveList.length-1, 1);
            this.channel.send(this.getOutput(false));
        }
    }
    
    getTypeFromUser(user) {
        var ind = this.players.indexOf(user.id);
        if(ind == -1) return false;
        return ind == 0 ? 1 : -1;
    }
    
    hasPlayer(id) {
        return this.players.includes(id);
    }
    
    getChannelID() {
        return this.channel.id;
    }
    
    getPlayers() {
        return this.players;
    }
    
    getUsernames() {
        return this.names;
    }
}

module.exports = Hex;