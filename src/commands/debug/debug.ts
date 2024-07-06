import {GuildMemberRoleManager} from "discord.js";
import {MOD_ROLES} from "../../env";
import {DiscordCommand, DiscordUserPermission} from "../../factory/commands_factory";

export default {
    name: 'debug',
    description: '[DEBUG] Gives the user a bunch of useful information',
    options: [],
    permissions: DiscordUserPermission.USER,
    handler: async (interaction) => {
        let isMod = false
        if (!interaction.member) return
        console.log('=== User roles ===');
        (interaction.member.roles as GuildMemberRoleManager).cache.forEach((e) => {
            console.log(`- ${e.name} (${e.id})`)
            if (MOD_ROLES.includes(`${e.id}`))
                isMod = true
        })
        console.log('\n=== Allowed roles ===')
        MOD_ROLES.forEach((e) => console.log(`- ${e}`))
        console.log(`\nisMod = ${isMod}`)
        await interaction.reply({
            content: 'Check your console',
            ephemeral: true
        })
    }
} as DiscordCommand