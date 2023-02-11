const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");

const wl_model = require("../../schemas/Whitelist");
const { COLOR, WHITELIST_SYSTEM } = require("../../config");

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot) return;

    if (
      WHITELIST_SYSTEM.ENABLED &&
      message.channel.id == WHITELIST_SYSTEM.SEND_CHANNEL
    ) {
      await message.delete().then(async (msg) => {
        if (
          msg.content.length > WHITELIST_SYSTEM.MINLENGTH &&
          msg.content.length < WHITELIST_SYSTEM.MAXLENGTH
        ) {
          const authorid = message.author.id;
          const check_channel = message.member.guild.channels.cache.get(
            WHITELIST_SYSTEM.CHECK_CHANNEL
          );
          try {
            await wl_model.findOne(
              { AuthorID: authorid },
              function (err, result) {
                if (err) return console.log(err);
                if (!result) {
                  const kasittely_embed = new EmbedBuilder()
                    .setTitle("Hakemus vastaanotettu!")
                    .setDescription("Whitelist hakemuksesi on vastaanotettu!")
                    .setColor(COLOR)
                    .setTimestamp();
                  message.author
                    .send({ embeds: [kasittely_embed] })
                    .catch(() => {
                      console.log(
                        "Viestiä ei voitu lähettää henkilölle: " + authorid
                      );
                    });
                  const buttons = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                      .setCustomId("wl_hyvaksy")
                      .setLabel("Hyväksy")
                      .setStyle(ButtonStyle.Success),
                    new ButtonBuilder()
                      .setCustomId("wl_hylkaa")
                      .setLabel("Hylkää")
                      .setStyle(ButtonStyle.Danger)
                  );
                  const hakemus_embed = new EmbedBuilder()
                    .setTitle("Hakemus")
                    .setColor(COLOR)
                    .setDescription(
                      "```" +
                        msg.content +
                        "```" +
                        `${msg.author} - ${msg.author.tag}`
                    )
                    .setTimestamp();
                  check_channel
                    .send({ embeds: [hakemus_embed], components: [buttons] })
                    .then((_msg) => {
                      const whitelist = new wl_model({
                        MessageID: _msg.id,
                        AuthorID: authorid,
                      });
                      whitelist.save();
                    });
                } else {
                  const embed = new EmbedBuilder()
                    .setTitle("Hakemus hylätty automaattisesti")
                    .setDescription(
                      `Et voi tehdä uutta hakemusta ennen kun vanha hakemuksesi on käsitelty loppuun!`
                    )
                    .setColor("Red")
                    .setTimestamp();

                  return message.author.send({ embeds: [embed] });
                }
              }
            );
          } catch (err) {
            console.log(err);
          }
        } else {
          const embed = new EmbedBuilder()
            .setTitle("Hakemus hylätty automaattisesti (Puutteellinen hakemus)")
            .setColor("Red")
            .setDescription(
              `Hakemuksesi oli liian pitkä. Muistathan, että hakemus voi olla korkeintaan 1600 merkkiä pitkä.`
            )
            .setTimestamp();

          return message.author.send({ embeds: [embed] });
        }
      });
    }
  },
};
