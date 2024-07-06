import {DiscordCommand, DiscordUserPermission} from "../../factory/commands_factory";
import {CommandInteraction} from "discord.js";
import {counter} from "../../counter/counter";

export default {
    name: "resurrect",
    description: "[MOD] Gives your guild another chance.",
    handler: async (interaction: CommandInteraction) => {
        counter.resurrect()
        await interaction.reply({
            content: `As you wish. Going back to **${counter.value}**. The next number is **${counter.value + 1}**.`,
            ephemeral: false
        })
    },
    options: [],
    permissions: DiscordUserPermission.ADMIN
} as DiscordCommand