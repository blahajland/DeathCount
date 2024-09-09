import { counter, DEFAULT_BASE_VALUE } from '../../counter/counter'
import {
    DiscordCommand,
    DiscordUserPermission,
} from '../../factory/commands-types'

export default {
    name: 'reset',
    description: `[MOD] Go back to ${DEFAULT_BASE_VALUE}.`,
    options: [],
    permissions: DiscordUserPermission.ADMIN,
    handler: async interaction => {
        counter.reset()
        await interaction.reply({
            content: `As you wish. Going back to **${DEFAULT_BASE_VALUE}**. The next number is **${DEFAULT_BASE_VALUE + 1}**.`,
            ephemeral: false,
        })
    },
} as DiscordCommand
