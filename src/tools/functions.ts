import { GuildMember } from 'discord.js'
import { TIMEOUT_ROLE } from './env'
import { counter } from '../counter/counter'

const equationRegex = /^\d+(?:\s*[+\-/*^]\s*\d+)+$/

const numberRegex = /^\s*\d+\s*$/

export const sleep = async (seconds: number) =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000))

export const isEquation = (value: string) => equationRegex.test(value)

export const isNumber = (value: string) => numberRegex.test(value)

export const applyPunishment = async (user: GuildMember, time: number) => {
    const timeoutRole = user.guild.roles.cache.find(r => r.id === TIMEOUT_ROLE)
    if (!timeoutRole) throw new Error('Unable to find a valid timeout role.')
    await user.roles.add(timeoutRole)
    await sleep(time * 12 * 3600)
    await user.roles.remove(timeoutRole)
}
