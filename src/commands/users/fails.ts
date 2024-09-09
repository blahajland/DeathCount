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
        let failures = ''
        counter.fails.forEach((v, e) => {
            failures += `- <@${e}> with ${v.value} ${v.value > 1 ? 'fails' : 'fail'}\n\n`
        })
        const embed = new EmbedBuilder().setTitle("NumberHaj's Hall of Shame")
        if (counter.fails.size === 0)
            embed.setDescription('Fortunately, nobody failed... For now.')
        else embed.setDescription(failures)
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    },
} as DiscordCommand
