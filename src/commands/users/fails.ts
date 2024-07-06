import {DiscordCommand, DiscordUserPermission} from "../../factory/commands_factory";
import {counter} from "../../counter/counter";

export default {
    name: 'fails',
    description: 'Shows a list of all the users who failed at basic math.',
    permissions: DiscordUserPermission.USER,
    options: [],
    handler: async (interaction) => {
        await interaction.reply({
            content: counter.getFailMessage(),
            ephemeral: true
        })
    }
} as DiscordCommand