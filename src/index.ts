import { Client, GatewayIntentBits } from 'discord.js'
import { CHANNEL, TOKEN } from './tools/env'
import { commands, syncDiscordCommands } from './factory/commands-factory'
import { applyPunishment, isEquation, isNumber } from './tools/functions'
import { counter, ValueEvolution } from './counter/counter'
import consola from 'consola'

const intents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
]
const client = new Client({
    intents: intents,
})

client.on('ready', () => {
    if (!client.user) throw new Error("The bot can't connect as a user.")
    consola.info(`Logged in as ${client.user.username}`)
})

client.on('interactionCreate', async interaction => {
    if (interaction.isCommand()) {
        const command = commands.get(interaction.commandName)
        if (!command) throw new Error("This command doesn't exist")
        await command.execute(interaction)
    }
})

client.on('messageCreate', async message => {
    if (!client.user) throw new Error("Unable to access the bot's user.")
    if (message.author.bot || message.channel.id !== CHANNEL) return
    const messageContent = message.content
    if (isEquation(messageContent))
        await message.reply({
            content:
                "**We don't want equations !** Remember, mods can reserve the right to **manually timeout** you...",
        })

    if (isNumber(messageContent)) {
        const value = Number(messageContent.trim())
        if (!message.guild)
            throw new Error("This message hasn't been sent in a guild.")
        const member = message.guild.members.cache.find(
            m => m.id === message.author.id,
        )
        if (!member) throw new Error('Unable to find a valid guild member.')
        switch (counter.increment(value, member)) {
            case ValueEvolution.FAIL:
                await message.react('⛔')
                await message.reply({
                    content: `<@${member.id}> ruined it at **${counter.lastValue + 1}**. As a result, we're starting back at **1**. Shame on them !`,
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
                await message.react('💥')
                throw new Error('Unknown value evolution.')
        }
    }
})

const init = async () => {
    await syncDiscordCommands()
    await client.login(TOKEN)
}

init().then()
