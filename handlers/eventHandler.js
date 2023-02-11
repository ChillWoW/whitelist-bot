function loadEvents(client) {
  const fs = require("fs");
  const folders = fs.readdirSync("./events");
  for (const folder of folders) {
    const files = fs
      .readdirSync(`./events/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of files) {
      const event = require(`../events/${folder}/${file}`);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
      continue;
    }
  }
}

module.exports = { loadEvents };
