import {DiscordCommand, DiscordUserPermission} from "../../factory/commands_factory";
import {counter} from "../../counter/counter";

export default {
    name: 'last',
    description: 'Shows which number has last been inputed.',
    permissions: DiscordUserPermission.USER,
    options: [],
    handler: async (interaction) => {
        const message = [
            `**Last value** : ${counter.value}`,
            `**Next value** : ${counter.value + 1}`,
            counter.lastUser ? `**Last user** : <@${counter.lastUser}>` : undefined,
            `**Best** : ${counter.best}`
        ].filter((e) => e)
        await interaction.reply({
            content: message.join('\n'),
            ephemeral: true
        })
    }
} as DiscordCommand