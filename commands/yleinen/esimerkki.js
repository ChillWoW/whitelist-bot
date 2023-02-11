const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("esimerkki")
    .setDescription("Kuvaus"),
    async execute(interaction, client) {
        //KOMENTO
    }
}