import discord

from discord.ext import commands

import funcs

import cogs.mod_cmds as modc
import cogs.user_cmds as userc

if funcs.config["DEBUG"] == 1:
    import cogs.debug_cmds as debc

intents = discord.Intents().all()
client = commands.Bot(intents=intents, command_prefix="c>")


@client.event
async def on_ready():
    print(f'Logged in as {client.user}')
    await client.add_cog(userc.UserCmds(client))
    await client.add_cog(modc.ModCmds(client))
    if funcs.config["DEBUG"] == 1:
        await client.add_cog(debc.DebugCmds(client))
        print("DEBUG COMMANDS ACTIVATED")
    cmds_lists = await client.tree.sync()
    print(f'Synced {len(cmds_lists)} commands')


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.channel.id != int(funcs.config["CHANNEL"]):
        return

    checkeq = funcs.isNumber(message.content)

    if checkeq == 1:
        await message.reply(
            "**We don't want equations !** Remember, mods can reserve the right to **manually timeout** you...")
        return

    if checkeq == 2:
        nb = int(message.content.split(" ")[0])
        res = funcs.count.increment(nb, message.author)
        if res < 0:
            await message.add_reaction("⛔")
            await message.reply(
                f"<@{message.author.id}> ruined it at **{funcs.count.getLastNumber() + 1}**." +
                " As a result, we're starting back at **1**. Shame on them !")
            await funcs.applyPunish(message.author, funcs.count.getFails()[str(message.author.id)],
                                    funcs.config["TIMEOUTROLE"])
            return
        else:
            if funcs.count.getValue() % 100 == 0:
                await message.add_reaction("💯")
                return
            if res == 1:
                await message.add_reaction("☑️")
                return
            else:
                await message.add_reaction("✅")
                return


@client.event
async def on_message_edit(before, after):
    if before.author == client.user:
        return

    if before.channel.id != int(funcs.config["CHANNEL"]):
        return

    if not funcs.isNumber(before.content) == 2:
        return

    await after.reply("**Beware of edits !** If you're unsure which number is next, user the **/nb** command !")


client.run(funcs.config["TOKEN"])
