import {DiscordCommand, DiscordUserPermission} from "../../factory/commands_factory";
import {CommandInteraction} from "discord.js";
import {counter} from "../../counter/counter";

export default {
    name: "reset",
    description: "[MOD] Go back to 1.",
    handler: async (interaction: CommandInteraction) => {
        counter.reset()
        await interaction.reply({
            content: 'As you wish. Going back to **0**. The next number is **1**',
            ephemeral: false
        })
    },
    options: [],
    permissions: DiscordUserPermission.ADMIN
} as DiscordCommand