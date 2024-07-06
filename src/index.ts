import {Client, GatewayIntentBits} from 'discord.js';
import {CHANNEL, TOKEN} from "./env";
import {commands, syncDiscordCommands} from "./factory/commands_factory";
import {applyPunishment, isEquation, isNumber} from "./tools/functions";
import {counter, ValueEvolution} from "./counter/counter";

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
]
const client = new Client({
    intents: intents
});

client.on('ready', () => {
    if (!client.user) return
    console.log(`Logged in as ${client.user.username}`)
})

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return
    commands.get(interaction.commandName)?.execute(interaction)
})

client.on('messageCreate', async (message) => {
    if (!client.user) return
    if (message.author.bot) return
    if (message.channel.id !== CHANNEL) return
    const messageContent = message.content
    if (isEquation(messageContent))
        await message.reply({
            content: "**We don't want equations !** Remember, mods can reserve the right to **manually timeout** you..."
        })

    if (isNumber(messageContent)) {
        const value = Number(messageContent.trim())
        if (!message.guild) return
        const member = message.guild.members.cache.find((m) => m.id === message.author.id)
        if (!member) return
        switch (counter.increment(value, member)) {
            case ValueEvolution.FAIL:
                await message.react('⛔')
                await message.reply({
                    content: `<@${member.id}> ruined it at **${counter.lastValue + 1}**. As a result, we're starting back at **1**. Shame on them !`
                })
                await applyPunishment(member)
                break
            case ValueEvolution.MILESTONE:
                await message.react('💯')
                break
            case ValueEvolution.BEST:
                await message.react('☑️')
                break
            case ValueEvolution.PASS:
                await message.react('✅')
                break
            default:
                throw new Error()
        }
    }
})

const init = async () => {
    await syncDiscordCommands()
    await client.login(TOKEN)
}

init().then()
