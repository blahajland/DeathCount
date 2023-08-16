import discord

from discord.ext import commands
from discord import app_commands

import json

from funcs import *

intents = discord.Intents().all()
client = commands.Bot(intents=intents, command_prefix="c>")

with open("config.json") as jsfile:
    rawdata = json.load(jsfile)

counter = {"value": 1, "record": 1, "last": 1, "usr": None}
fails = {}


class Comms(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="nb", description="Show which number has last been inputed.")
    async def nb(self, ctx: discord.Interaction):
        await ctx.response.send_message("Last value inputed : **" + str(counter["value"] - 1) + "**", ephemeral=True)

    @app_commands.command(name="reset", description="Go back to 1. Works only if you're an administrator.")
    async def reset(self, ctx: discord.Interaction):
        if not ctx.user.guild_permissions.administrator:
            await ctx.response.send_message("You can only use this command if you're an **administrator**.",
                                            ephemeral=True)
            return
        await ctx.response.send_message("As you wish. Going back to **1**.", ephemeral=False)
        counter["value"] = 1

    @app_commands.command(name="resurrect",
                          description="Give your team another chance ! Works only if you're an administrator.")
    async def resurrect(self, ctx: discord.Interaction):
        if not ctx.user.guild_permissions.administrator:
            await ctx.response.send_message("You can only use this command if you're an **administrator**.",
                                            ephemeral=True)
            return
        await ctx.response.send_message("As you wish. Going back to **" + str(counter["last"]) + "**.", ephemeral=False)
        counter["value"] = counter["last"]
        counter["usr"] = None;

    @app_commands.command(name="timeout",
                          description="Timeout an annoying player. Works only if you're an administrator.")
    async def timeout(self, ctx: discord.Interaction, user: discord.Member, time: int):
        if not ctx.user.guild_permissions.administrator:
            await ctx.response.send_message("You can only use this command if you're an **administrator**.",
                                            ephemeral=True)
            return
        timeout_role = user.guild.get_role(int(rawdata["TIMEOUTROLE"]))
        await ctx.response.send_message(
            "<@" + str(user.id) + "> has been timed out for **" + str(time) + "** minute(s).",
            ephemeral=False)
        await user.add_roles(timeout_role)
        await asyncio.sleep(60 * time)
        await user.remove_roles(timeout_role)

    @app_commands.command(name="fails", description="Shows who doomed us all.")
    async def fails(self, ctx: discord.Interaction):
        resp = ""
        for ppl in fails.keys():
            resp += "<@" + ppl + "> : " + str(fails[ppl]) + "\n"
        await ctx.response.send_message(resp, ephemeral=True)


@client.event
async def on_ready():
    print(f'Logged in as {client.user}')
    await client.add_cog(Comms(client))
    await client.tree.sync()


@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.channel.id != int(rawdata["CHANNEL"]):
        return

    checkeq = isequation(message.content)

    if checkeq == 1:
        await message.reply(
            "**We don't want equations !** Remember, mods can reserve the right to **manually timeout** you...")
        return

    if checkeq == 2:
        if int(message.content) == counter["value"] and message.author != counter["usr"]:
            counter["value"] += 1
            counter["usr"] = message.author
            if (counter["value"] - 1) % 100 == 0:
                await message.add_reaction("💯")
            if (counter["value"] - 1) > counter["record"]:
                counter["record"] = counter["value"]
                if (counter["value"] - 1) % 100 != 0:
                    await message.add_reaction("☑️")
            else:
                await message.add_reaction("✅")
        else:
            counter["last"] = counter["value"]
            counter["value"] = 1
            if str(message.author.id) not in fails.keys():
                fails[str(message.author.id)] = 1
            else:
                fails[str(message.author.id)] += 1
            await message.add_reaction("⛔")
            if message.author == counter["usr"]:
                await message.reply("<@" + str(message.author.id) + "> answered twice at **" + str(
                    counter["last"]) + "**. As a result, we're starting back at **1**. Shame on them !")
            else:
                await message.reply("<@" + str(message.author.id) + "> ruined it at **" + str(
                    counter["last"]) + "**. As a result, we're starting back at **1**. Shame on them !")
            counter["usr"] = None
            await apply_punish(message.author, fails[str(message.author.id)], rawdata["TIMEOUTROLE"])


@client.event
async def on_message_edit(before, after):
    if before.author == client.user:
        return

    if before.channel.id != int(rawdata["CHANNEL"]):
        return

    if not isequation(before.content) == 2:
        return

    await after.reply("**Beware of edits !** If you're unsure which number is next, user the **/nb** command !")


client.run(rawdata["TOKEN"])
