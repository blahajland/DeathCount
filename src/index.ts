import { Client, GatewayIntentBits } from 'discord.js'
import { TOKEN } from './tools/config'
import { commands, syncDiscordCommands } from './factory/commands-factory'
import {
    applyPunishment,
    dontPingUser,
    isMessageInvalid,
    processEntry,
    processEquation,
} from './tools/functions'
import { counter, ValueEvolution } from './counter/counter'
import consola from 'consola'

consola.start('Starting NumberHaj...')

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

client.on('messageDelete', async message => {
    if (isMessageInvalid(message)) return
    if (!processEntry(message.content!)) return
    await message.channel.send({
        content: `⚠️ **Beware !** <@${message.author!.id}> deleted a message. Remember to check \`/stats\` to know what to type next.\nOld message : \`${message.content}\``,
    })
})

client.on('messageUpdate', async message => {
    if (isMessageInvalid(message)) return
    if (!processEntry(message.content!)) return
    await message.channel.send({
        content: `⚠️ **Beware !** <@${message.author!.id}> edited a message. Remember to check \`/stats\` to know what to type next.\nOld message : \`${message.content}\``,
    })
})

client.on('messageCreate', async message => {
    if (!client.user) throw new Error("Unable to access the bot's user.")
    if (isMessageInvalid(message)) return
    const messageContent = message.content
    const value = processEquation(messageContent.trim())
    if (value) {
        if (!message.guild)
            throw new Error("This message hasn't been sent in a guild.")

        const member = message.guild.members.cache.find(
            m => m.id === message.author.id,
        )
        if (!member) throw new Error('Unable to find a valid guild member.')

        if (value.isBroken)
            await message.reply({
                content: `# What the fuck !?`,
                ...dontPingUser,
            })
        else if (value.isEquation)
            await message.reply({
                content: `**${value.original}** equals **${value.result}**.`,
                ...dontPingUser,
            })

        switch (counter.increment(value.result, member)) {
            case ValueEvolution.FAIL_COUNT:
                await message.react('⛔')
                await message.reply({
                    content: `<@${member.id}> ruined it at **${counter.lastValue + 1}**. As a result, we're starting back at **1**. Shame on them !`,
                })
                await applyPunishment(member, counter.getFailNumber(member))
                break
            case ValueEvolution.FAIL_USER:
                await message.react('⛔')
                await message.reply({
                    content: `<@${member.id}> counted twice in a row. As a result, we're starting back at **1**. Shame on them !`,
                })
                await applyPunishment(member, counter.getFailNumber(member))
                break
            case ValueEvolution.SABOTAGE:
                await message.react('🤨')
                await message.reply({
                    content: `<@${member.id}> tried to **SABOTAGE** the count! You fu\\*\\*\\*\\*.`,
                })
                await applyPunishment(member, 14) // One week
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
    try {
        await syncDiscordCommands()
        await client.login(TOKEN)
    } catch (err: any) {
        consola.error(err)
        process.exit(1)
    }
}

init().then()
