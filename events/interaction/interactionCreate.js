const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const wl_model = require("../../schemas/Whitelist");

const { WHITELIST_SYSTEM } = require("../../config");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const { customId, message, guild } = interaction;
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        interaction.reply({ content: "outdated command" });
      }

      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      await wl_model.findOneAndDelete(
        { MessageID: message.id },
        function (err, data) {
          if (err) return console.log(err);
          if (data) {
            const ID = data.AuthorID;
            client.users.fetch(ID).then(async (user) => {
              let edit_embed_data = { color: null, title: "" };
              const edit_embed = new EmbedBuilder();
              switch (customId) {
                case "wl_hyvaksy":
                  edit_embed_data.color = "Green";
                  edit_embed_data.title = "Hyväksytty!";
                  const embed_hyvaksytty = new EmbedBuilder()
                    .setTitle("Hakemus hyväksytty!")
                    .setColor("Green")
                    .setDescription("Hakemuksesi on hyväksytty!")
                    .setTimestamp();
                  user.send({ embeds: [embed_hyvaksytty] }).catch(() => {
                    console.log("Viestiä ei voitu lähettää henkilölle: " + ID);
                  });
                  if (WHITELIST_SYSTEM.WHITELIST_ROLE) {
                    const _user = guild.members.cache.get(ID);
                    _user.roles
                      .add(WHITELIST_SYSTEM.WHITELIST_ROLE)
                      .catch(() => {
                        console.log("Käyttäjää ei löytynyt.." + _ID);
                      });
                  }
                  break;
                case "wl_hylkaa":
                  edit_embed_data.color = "Red";
                  edit_embed_data.title = "Hylätty!";
                  const embed_hylatty = new EmbedBuilder()
                    .setTitle("Hakemus hylätty!")
                    .setColor("Red")
                    .setDescription("Hakemuksesi on hylätty!")
                    .setTimestamp();
                  user.send({ embeds: [embed_hylatty] });
                  break;
              }

              const edit_buttons = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setCustomId("wl_hyvaksy")
                  .setLabel("Hyväksy")
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                  .setCustomId("wl_hylkaa")
                  .setLabel("Hylkää")
                  .setDisabled(true)
                  .setStyle(ButtonStyle.Danger)
              );

              edit_embed.setTitle(edit_embed_data.title);
              edit_embed.setColor(edit_embed_data.color);
              edit_embed.setDescription(message.embeds[0].description);
              edit_embed.setTimestamp();
              interaction.update({
                embeds: [edit_embed],
                components: [edit_buttons],
              });
            });
          }
        }
      );
    }
  },
};
