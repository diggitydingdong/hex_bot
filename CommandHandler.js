var helper = require('./helper.js');
var info = require('./info.json');
const HexGameHandler = require('./HexGameHandler.js');

class CommandHandler {
    
    static processCommand(message)
    {
        let args = helper.getMessageAsArgs(message, info.prefix);
        switch(args[0])
        {
            case "hex":
                HexGameHandler.processCommand(message);
                break;
            default:
                // TODO UNRECOGNISABLE COMMAND
                break;
        }
    }
}

module.exports = CommandHandler;