import asyncio

import json

import counter

with open("config.json") as jsfile:
    config = json.load(jsfile)

count = counter.Counter()

allowed_users = []


def isEquation(s: str):
    if s == "":
        return 0
    nb = 0
    symb = 0
    for e in s:
        if e < "0" or e > "9":
            nb += 1
        elif e in ["+", "-", "/", "*", "^"]:
            symb += 1
        else:
            return 0
    if symb != 0:
        if nb == 0:
            return 0
        return 1
    if nb != 0:
        return 2


def isNumber(s: str):
    if s == "":
        return 0
    s = s.split(" ")[0]
    for e in s:
        if e < "0" or e > "9":
            return 0
        return 2


async def applyPunish(user, punish, role_id):
    timeout_role = user.guild.get_role(int(role_id))
    await user.add_roles(timeout_role)
    if punish == 1:
        await asyncio.sleep(12 * 3600)
        await user.remove_roles(timeout_role)
        return
    if punish == 2:
        await asyncio.sleep(24 * 3600)
        await user.remove_roles(timeout_role)
        return


async def isMod(ctx, rolelist):
    if ctx.user.id not in allowed_users:
        usr_roles = ctx.user.roles
        for e in usr_roles:
            if str(e.id) in rolelist:
                allowed_users.append(ctx.user.id)
                return True
        await ctx.response.send_message("You can only use this command if you're an **administrator**.",
                                        ephemeral=True)
        return False
    return True
