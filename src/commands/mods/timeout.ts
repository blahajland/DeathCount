import {DiscordCommand, DiscordOptionType, DiscordUserPermission} from "../../factory/commands_factory";
import {CommandInteraction} from "discord.js";
import {TIMEOUT_ROLE} from "../../env";
import {sleep} from "../../tools/sleep";

export default {
    name: "timeout",
    description: "[MOD] Times out an annoying player.",
    options: [
        {
            name: 'member',
            type: DiscordOptionType.USER,
            required: true
        },
        {
            name: 'time',
            type: DiscordOptionType.NUMBER,
            required: true,
            min: 0
        }
    ],
    handler: async (interaction: CommandInteraction) => {
        // @ts-ignore
        const user = interaction.options.getUser('member')
        // @ts-ignore
        const time = interaction.options.getNumber('time')
        if (!interaction.guild) return
        const role = interaction.guild.roles.cache.find((r) => r.id === TIMEOUT_ROLE)
        const member = interaction.guild.members.cache.find((r) => r.id === user.id)
        if (!member || !role) return
        await member.roles.add(role)
        await interaction.reply({
            content: `<@${user.id}> has been timed out for **${time}** minutes`,
            ephemeral: false
        })
        await sleep(60 * time)
        await member.roles.remove(role)
    },
    permissions: DiscordUserPermission.ADMIN
} as DiscordCommand