const Discord = require('discord.js');
const client  = new Discord.Client();
const CommandHandler = require('./CommandHandler.js');
const HexGameHandler = require('./HexGameHandler.js');
var auth = require('./auth.json'); //  Contains the authorisation token needed for connection.
var helper = require('./helper.js'); // Helper functions
var info = require('./info.json'); // Info like prefix and such
var ready = false

// Probably overusing await
async function init()
{
    // Set the activity to whatever specified.
    await client.user.setActivity("Hex. " + info.prefix + "hex start @User");
    
    // Log all the guilds (servers) and their id's that the bot is located in.
    helper.guildList = client.guilds.cache
    console.log("Ready in " + client.guilds.cache.size);
    console.log(client.guilds.cache.map(g => `${g.name} [${g.id}]`).join("\n"));
    
    // Init HGH     
    HexGameHandler.gameList = [];
    HexGameHandler.usersInGame = [];
    
    ready = true
}

// Event listener for when the bot is ready (duh).
client.once('ready', init)

client.login(auth.token);

// Event Listener for messages.
client.on('message', message => {
  if(message.author.bot || !ready) return; // Do not listen to commands if they are sent by a bot.

  // Check if the message is intended to be a command.
  if(helper.messageMatchPrefix(message, info.prefix))
  {
      var args = helper.getMessageAsArgs(message, info.prefix)
      if(args.length == 0 || args[0] == "help") return; /// TODO display help message
      
      CommandHandler.processCommand(message);
      
      // Simple test to prove connectivity between the bot and here
      // message.channel.send("Recognised following command: " + args);
      // 
      // if(args[0] == "category")
      // {
      //     message.guild.channels.create(args[1], {
      //         type: 'text',
      //         parent: message.channel.parent
      //     })
      // }
  } else {
      HexGameHandler.processMove(message);
  }

});

// Event Listener for when reactions are added
client.on('messageReactionAdd', (reaction, user) => {
  if(user.bot || !ready) return;

  
});

// Event Listener for when reactions are removed
client.on('messageReactionRemove', (reaction, user) => {
  if(user.bot || !ready) return;

});