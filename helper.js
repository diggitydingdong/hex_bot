// const info = require("./info.json");

module.exports = {
  guildList: [],
  idInGuildList: function(id)
  {
      return Array.from(this.guildList.keys()).includes(id);
  },
  
  getMessageAsArgs: function (message, prefix)
  {
      return message.content.substring(prefix.length).split(" ");
  },

  messageMatchPrefix: function (message, prefix)
  {
      return message.content.substring(0, prefix.length).toLowerCase() == prefix;
  },
  
  // https://stackoverflow.com/questions/10834796/validate-that-a-string-is-a-positive-integer
  isNormalInteger: function (str) {
      return /^\+?(0|[1-9]\d*)$/.test(str);
  },
  
  getFirstStringInsideQuotes: function (str) {
      let s = str.match(/"([^"]+)"/);
      return s == null ? "" : s[1];
  },
  
  occurencesOfChar: function(str, char)
  {
      let indices = [];
      for(var i=0; i<str.length;i++) {
          if (str[i] === char) indices.push(i);
      }
      return indices;
  },
  
  validateCommandWithQuotes: function(cmd, argWithQuotes)
  {
      let args = cmd.split(" ");
      let ind = this.occurencesOfChar(cmd, '"');
      // console.log(`ind[0]: ${ind[0]}, ind[1]: ${ind[1]}, args[argWithQuotes].indexOf('"'): ${args[argWithQuotes].indexOf('"')}, cmd.length: ${cmd.length}`)
      // console.log(args)
      // console.log()
      // used to be an if statement
      return !(args.length < argWithQuotes || // Command has correct amount of arguments
          ind.length != 2 || // Command has only two quotes     
          args[argWithQuotes].indexOf('"') != 0 || // First quote is at the beginning of arg[argWithQuotes]
          ind[1] != cmd.length-1); // Last quote is at the end of the command
          // return false;
      // return true;
  },
  
  isWord: function(str)
  {
      return /[^\w]/.test(str)
      // return this.matchesRegex(str, /[\w]/);
  },
}
