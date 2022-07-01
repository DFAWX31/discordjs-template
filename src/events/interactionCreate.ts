import { Interaction, MessageEmbed } from "discord.js";

import { Bot } from "../structures";
import { TypedEvent } from "../types";

export default TypedEvent({
	eventName: "interactionCreate",
	run: async (client: Bot, interaction: Interaction) => {
		if (interaction.isCommand() || interaction.isContextMenu()) {
			const command = client.commands.get(interaction.commandName);

			if (!command) return;

			if (!interaction.inCachedGuild()) return;

			try {
				await command.execute(interaction, client);
			} catch (e) {
				let msg = "NULL";
				if (e instanceof Error) {
					msg = e.message;
				} else if (typeof e === "object" && e !== null) {
					msg.toString();
				}

				console.error(e);

				const errorEmbed = new MessageEmbed()
					.setColor("RED")
					.setDescription(
						"An error occured"
					);

				if (interaction.deferred) {
					await interaction.editReply({
						embeds: [errorEmbed],
					});
				} else if (interaction.replied) {
					await interaction.followUp({
						embeds: [errorEmbed],
						ephemeral: true
					});
				} else {
					await interaction.reply({
						embeds: [errorEmbed],
						ephemeral: true
					});
				}
			}

		}
	}
});