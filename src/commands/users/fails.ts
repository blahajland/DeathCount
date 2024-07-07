import { counter } from '../../counter/counter'
import {
    DiscordCommand,
    DiscordUserPermission,
} from '../../factory/commands-types'
import { EmbedBuilder } from 'discord.js'

export default {
    name: 'fails',
    description: 'Shows a list of all the users who failed at basic math.',
    permissions: DiscordUserPermission.USER,
    options: [],
    handler: async interaction => {
        const failures: { name: string; value: string }[] = []
        counter.fails.forEach((v, e) => {
            failures.push({
                name: `Has failed ${v} times`,
                value: `<@${e}>`,
            })
        })
        const embed = new EmbedBuilder().setTitle("NumberHaj's Hall of Shame")
        if (counter.fails.size === 0)
            embed.setDescription('Fortunately, nobody failed... For now.')
        else embed.addFields(...failures)
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    },
} as DiscordCommand