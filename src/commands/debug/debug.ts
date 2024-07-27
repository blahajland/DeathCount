import { EmbedBuilder, GuildMemberRoleManager } from 'discord.js'
import { MOD_ROLES } from '../../tools/config'
import {
    DiscordCommand,
    DiscordUserPermission,
} from '../../factory/commands-types'
import consola from 'consola'

interface RoleInfo {
    name: string
    id: string
}

export default {
    name: 'debug',
    description: '[DEBUG] Gives a bunch of useful information',
    options: [],
    permissions: DiscordUserPermission.ADMIN,
    handler: async interaction => {
        consola.warn(
            `${interaction.user.globalName} (${interaction.user.id}) used /debug.`,
        )
        if (!interaction.member)
            throw new Error(
                "This interaction hasn't been performed by a guild member.",
            )
        const rolesManager = interaction.member.roles as GuildMemberRoleManager

        let userRoles = ''
        let modRoles = ''
        let isMod = false

        rolesManager.cache.forEach((e: RoleInfo) => {
            userRoles += `- **${e.name}** (${e.id})\n`
            if (MOD_ROLES.includes(e.id)) isMod = true
        })
        MOD_ROLES.forEach(e => (modRoles += `- ${e}\n`))
        const embed = new EmbedBuilder()
            .setTitle('Debug info')
            .setDescription(new Date().toLocaleString())
            .addFields(
                {
                    name: `${interaction.user.globalName}'s roles`,
                    value: userRoles,
                },
                { name: 'Mod roles', value: modRoles },
                { name: 'Are you a mod ?', value: isMod ? 'Yes !' : 'No...' },
            )
        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        })
    },
} as DiscordCommand
