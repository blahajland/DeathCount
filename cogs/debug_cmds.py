import discord

from discord.ext import commands
from discord import app_commands

import funcs


class DebugCmds(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @app_commands.command(name="ckeckmod")
    async def ckeckmod(self, ctx: discord.Interaction):
        usr_roles = []
        ismod = False
        for e in ctx.user.roles:
            usr_roles.append(f"{e.name} ({e.id})")
            if str(e.id) in funcs.config["MODROLES"]:
                ismod = True
        print("=== User roles ===")
        for e in usr_roles:
            print(e)
        print("\n=== Allowed roles ===")
        for e in funcs.config["MODROLES"]:
            print(e)
        print(f'\nisMod = {ismod}')
        await ctx.response.send_message("check stdout", ephemeral=True)
        return
