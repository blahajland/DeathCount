import discord

from discord.ext import commands
from discord import app_commands

import asyncio

import funcs


class ModCmds(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="reset", description="Go back to 1. Works only if you're an administrator.")
    async def reset(self, ctx: discord.Interaction):
        ismod = await funcs.isMod(ctx, funcs.config["MODROLES"])
        if not ismod:
            return
        funcs.count.reset()
        await ctx.response.send_message("As you wish. Going back to **0**. The next number is **1**", ephemeral=False)

    @app_commands.command(name="resurrect",
                          description="Give your team another chance ! Works only if you're an administrator.")
    async def resurrect(self, ctx: discord.Interaction):
        ismod = await funcs.isMod(ctx, funcs.config["MODROLES"])
        if not ismod:
            return
        funcs.count.setValue(funcs.count.getLastNumber())
        await ctx.response.send_message(
            f"As you wish. Going back to **{funcs.count.getValue()}**." +
            f"The next number is **{funcs.count.getValue() + 1}**",
            ephemeral=False)

    @app_commands.command(name="timeout",
                          description="Timeout an annoying player. Works only if you're an administrator.")
    async def timeout(self, ctx: discord.Interaction, user: discord.Member, time: int):
        ismod = await funcs.isMod(ctx, funcs.config["MODROLES"])
        if not ismod:
            return
        if time < 0:
            await ctx.response.send_message("This number is invalid.", ephemeral=True)
            return
        timeout_role = user.guild.get_role(int(funcs.config["TIMEOUTROLE"]))

        await user.add_roles(timeout_role)
        await ctx.response.send_message(
            "<@" + str(user.id) + "> has been timed out for **" + str(time) + "** minute(s).",
            ephemeral=False)
        await asyncio.sleep(60 * time)
        await user.remove_roles(timeout_role)

    @app_commands.command(name="setnb",
                          description="Set the counter to a specific number.")
    async def setnb(self, ctx: discord.Interaction, number: int):
        ismod = await funcs.isMod(ctx, funcs.config["MODROLES"])
        if not ismod:
            return
        if number < 1:
            await ctx.response.send_message("This number is invalid.", ephemeral=True)
            return
        funcs.count.setValue(number)
        await ctx.response.send_message(
            f"As you wish. Going straight to **{number}**. The next number is **{number + 1}**", ephemeral=False)
        return