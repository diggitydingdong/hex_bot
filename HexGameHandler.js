var helper = require('./helper.js');
var info = require('./info.json');
const Hex = require('./Hex.js');
const Board = require('./Board.js');

class HexGameHandler {
    
    constructor() {
    }
    
    static startGame(message) {
        let args = helper.getMessageAsArgs(message, info.prefix);
        // Error handling
        if(message.mentions.users.first() === undefined || args.length < 3) {
            message.channel.send("Proper command usage: " + info.prefix + "hex start @User <size>");
        } else if(this.usersInGame.includes(message.author.id)) {
            message.channel.send("You are in a game already.");
        } else if(this.usersInGame.includes(message.mentions.users.first().id)) {
            message.channel.send("Your opponent is in a game already.");
        } else if(args.length >= 4 && !helper.isNormalInteger(args[3])) {
            message.channel.send("Invalid board size.");
        } else {
            var bs = (args.length < 4 ? 11 : parseInt(args[3]));
            if(bs < 3) bs = 3;
            else if(bs > 26) bs = 26;
            var Game = new Hex(message.channel, bs, message.author, message.mentions.users.first());
            
            console.log("Starting game " + message.author.username + " vs " + message.mentions.users.first().username);
            this.gameList.push(Game);
            this.usersInGame.push(message.author.id, message.mentions.users.first().id);
            
            Game.start();
        }
    }
    
    static stopGameWithId(id) {
        var g = this.getIndOfGame(id);
        var ps = this.gameList[g].getPlayers();
        var p_names = this.gameList[g].getUsernames();
        
        this.usersInGame.splice(this.usersInGame.indexOf(ps[0]), 2);
        this.gameList.splice(g, 1);
        
        console.log("Stopping game " + p_names[0] + " vs " + p_names[1]);
    }
    
    static stopGame(message) {
        if(!this.usersInGame.includes(message.author.id)) {
            message.channel.send("You're not in a game.");
        } else {
            this.stopGameWithId(message.author.id);
            
            message.channel.send("Game stopped.")
            
        }
    }
    
    static undo(message) {
        if(!this.usersInGame.includes(message.author.id)) {
            message.channel.send("You're not in a game.");
        } else {
            var g = this.getIndOfGame(message.author.id);
            this.gameList[g].undo(message.author.id);
            message.channel.send("Move undone.")
            
        }
    }
    
    static processCommand(message)
    {
        let args = helper.getMessageAsArgs(message, info.prefix);
        switch(args[1])
        {
            case "start":
                this.startGame(message);
                break;
            case "stop":
                this.stopGame(message);
                break;
            case "undo":
                this.undo(message);
                break;
            default:
                // TODO UNRECOGNISABLE COMMAND
                break;
        }
    }
    
    static processMove(message) {
        if(Board.isMove(message.content) === false) return;
        if(!this.usersInGame.includes(message.author.id)) return;
        
        var g = this.getIndOfGame(message.author.id);
        if(message.channel.id == this.gameList[g].getChannelID()) {
            this.gameList[g].play(message);
            if(this.gameList[g].over) this.stopGameWithId(message.author.id);
        }
    }
    
    static getIndOfGame(id) {
        for(var g = 0; g < this.gameList.length; g++) {
            if(this.gameList[g].hasPlayer(id)) {
                return g;
            }
        }
    }
}

module.exports = HexGameHandler;