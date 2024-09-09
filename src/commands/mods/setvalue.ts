import { counter } from '../../counter/counter'
import {
    DiscordCommand,
    DiscordOptionType,
    DiscordUserPermission,
} from '../../factory/commands-types'

export default {
    name: 'setvalue',
    description: '[MOD] Set the counter to a specific number.',
    options: [
        {
            name: 'value',
            type: DiscordOptionType.NUMBER,
            required: true,
            min: 0,
        },
    ],
    permissions: DiscordUserPermission.ADMIN,
    handler: async interaction => {
        const value = interaction.options.get('value', true).value as number
        counter.setValue(value)
        await interaction.reply({
            content: `As you wish. Going straight to **${value}**. The next number is **${value + 1}**.`,
            ephemeral: false,
        })
    },
} as DiscordCommand
