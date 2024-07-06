import {DiscordCommand, DiscordOptionType, DiscordUserPermission} from "../../factory/commands_factory";
import {counter} from "../../counter/counter";

export default {
    name: 'setvalue',
    description: '[MOD] Set the counter to a specific number.',
    options: [{
        name: 'value',
        type: DiscordOptionType.NUMBER,
        required: true,
        min: 0
    }],
    permissions: DiscordUserPermission.ADMIN,
    handler: async (interaction) => {
        // @ts-ignore
        const value: number = interaction.options.getNumber('value')
        counter.setValue(value)
        await interaction.reply({
            content: `As you wish. Going straight to **${value}**. The next number is **${value + 1}**`,
            ephemeral: false
        })
    }
} as DiscordCommand