import { counter } from '../../counter/counter'
import {
    DiscordCommand,
    DiscordUserPermission,
} from '../../factory/commands-types'

export default {
    name: 'resurrect',
    description: '[MOD] Gives your guild another chance.',
    options: [],
    permissions: DiscordUserPermission.ADMIN,
    handler: async interaction => {
        counter.resurrect()
        await interaction.reply({
            content: `As you wish. Going back to **${counter.value}**. The next number is **${counter.value + 1}**.`,
            ephemeral: false,
        })
    },
} as DiscordCommand
