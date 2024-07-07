import { counter } from '../../counter/counter'
import {
    DiscordCommand,
    DiscordUserPermission,
} from '../../factory/commands-types'
import { EmbedBuilder } from 'discord.js'

export default {
    name: 'stats',
    description: 'Shows which number has last been entered.',
    permissions: DiscordUserPermission.USER,
    options: [],
    handler: async interaction => {
        const embed = new EmbedBuilder().setTitle('Statistics').addFields(
            {
                name: 'Last value',
                value: `${counter.value} (next one is ${counter.value + 1})`,
                inline: true,
            },
            { name: 'Best score', value: `${counter.best}`, inline: true },
            {
                name: 'Last user',
                value: counter.lastUser ? `<@${counter.lastUser}>` : '[none]',
            },
        )
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    },
} as DiscordCommand
