import asyncio

def isequation(s: str):
    if s == "":
        return 0
    nb = 0
    symb = 0
    for e in s:
            if e > "0" and e < "9":
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


async def apply_punish(user, punish, role_id):
    timeout_role = user.guild.get_role(int(role_id))
    await user.add_roles(timeout_role)
    if punish ==  1:
            await asyncio.sleep(12 * 3600)
            await user.remove_roles(timeout_role)
            return
    if punish == 2:
            await asyncio.sleep(24 * 3600)
            await user.remove_roles(timeout_role)
            return
