import discord

from discord.ext import commands
from discord import app_commands

import funcs


class UserCmds(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="nb", description="Show which number has last been inputed.")
    async def nb(self, ctx: discord.Interaction):
        await ctx.response.send_message(
            f'**Last value inputed** : {funcs.count.getValue()}' +
            f'\n**Next value** : {funcs.count.getValue() + 1}' +
            f'\n**Record** : {funcs.count.getRecord()} ',
            ephemeral=True)
        return

    @app_commands.command(name="fails", description="Shows a list of all the users who failed.")
    async def fails(self, ctx: discord.Interaction):
        str = funcs.count.getFailsStr()
        if str == 1:
            await ctx.response.send_message("Fortunately, nobody failed... For now.", ephemeral=True)
            return
        await ctx.response.send_message(str, ephemeral=True)
        return
