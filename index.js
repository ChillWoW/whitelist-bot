const {
  Client,
  GatewayIntentBits,
  Collection,
  Partials,
} = require("discord.js");
const { connect } = require("mongoose");

const { loadEvents } = require("./handlers/eventHandler");
const { loadCommands } = require("./handlers/commandHandler");
const { MONGOURL, TOKEN } = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.User, Partials.Message],
});
client.commands = new Collection();

connect(MONGOURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})
  .then(() => {
    console.log("[MongoDB] Yhdistetty");
  })
  .catch((err) => {
    console.log(err);
  });

client.login(TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});
