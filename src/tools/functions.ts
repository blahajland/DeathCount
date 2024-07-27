import { GuildMember } from 'discord.js'
import { ALLOW_EQUATIONS, TIMEOUT_ROLE } from './config'

export const sleep = async (seconds: number) =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000))

const withoutEquation = /^(\d+)$/
const withEquation = /^(\d+)\s?(?:([+\-*\/^])\s?(\d+))?$/

const isValidEntry = ALLOW_EQUATIONS ? withEquation : withoutEquation

export const processEquation = (value: string) => {
    const matches = isValidEntry.exec(value)
    if (!matches) return null
    if (!(matches[2] && matches[3])) return Number(matches[1])
    const val1 = Number(matches[1])
    const val2 = Number(matches[3])
    let ret = 0
    switch (matches[2]) {
        case '+':
            ret = val1 + val2
            break
        case '-':
            ret = val1 - val2
            break
        case '*':
            ret = val1 * val2
            break
        case '/':
            if (val2 !== 0) ret = Math.round(val1 / val2)
            break
        case '^':
            ret = Math.pow(val1, val2)
            break
        default:
            throw new Error('Invalid operator')
    }
    if (ret === Infinity || isNaN(ret)) return 0
    return Math.abs(ret)
}

export const applyPunishment = async (user: GuildMember, time: number) => {
    const timeoutRole = user.guild.roles.cache.find(r => r.id === TIMEOUT_ROLE)
    if (!timeoutRole) throw new Error('Unable to find a valid timeout role.')
    await user.roles.add(timeoutRole)
    await sleep(time * 12 * 3600)
    await user.roles.remove(timeoutRole)
}
