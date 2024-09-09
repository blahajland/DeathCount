import { TIMEOUT_ROLE } from '../../tools/config'
import { sleep } from '../../tools/functions'
import {
    DiscordCommand,
    DiscordOptionType,
    DiscordUserPermission,
} from '../../factory/commands-types'
import { GuildMember } from 'discord.js'

export default {
    name: 'timeout',
    description: '[MOD] Times out an annoying player.',
    options: [
        {
            name: 'member',
            type: DiscordOptionType.USER,
            required: true,
        },
        {
            name: 'time',
            type: DiscordOptionType.NUMBER,
            required: true,
            min: 0,
        },
    ],
    handler: async interaction => {
        const member = interaction.options.get('member')?.member as GuildMember
        const time = interaction.options.get('time')?.value as number
        if (!interaction.guild)
            throw new Error("This interaction hasn't been made in a guild.")
        const role = interaction.guild.roles.cache.find(
            r => r.id === TIMEOUT_ROLE,
        )
        if (!member || !role)
            throw new Error('Unable to find a valid member/role.')
        await member.roles.add(role)
        await interaction.reply({
            content: `<@${member.id}> has been timed out for **${time}** minutes.`,
            ephemeral: false,
        })
        await sleep(60 * time)
        await member.roles.remove(role)
    },
    permissions: DiscordUserPermission.ADMIN,
} as DiscordCommand
