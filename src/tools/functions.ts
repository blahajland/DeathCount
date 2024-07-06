import {GuildMember} from "discord.js";
import {TIMEOUT_ROLE} from "../env";
import {counter} from "../counter/counter";
import {sleep} from "./sleep";

const equationRegex = /^\d+(?:\s*[+\-\/*^]\s*\d+)+$/

const numberRegex = /^\s*\d+\s*$/

export const isEquation = (value: string) => equationRegex.test(value)

export const isNumber = (value: string) => numberRegex.test(value)

export const applyPunishment = async (user: GuildMember) => {
    const timeoutRole = user.guild.roles.cache.find((r) => r.id === TIMEOUT_ROLE)
    if (!timeoutRole) return
    await user.roles.add(timeoutRole)
    const numberOfFails = counter.fails.get(user.id) ?? 0
    await sleep(numberOfFails * 12 * 3600)
    await user.roles.remove(timeoutRole)

}