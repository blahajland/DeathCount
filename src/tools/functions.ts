import {
    GuildMember,
    type Message,
    type MessageReplyOptions,
    type PartialMessage,
} from 'discord.js'
import { ALLOW_EQUATIONS, COUNTING_CHANNEL, TIMEOUT_ROLE } from './config'

export const sleep = async (seconds: number) =>
    new Promise(resolve => setTimeout(resolve, seconds * 1000))

const withoutEquation = /^(\d+)$/
const withEquation = /^(\d+)\s?(?:([+\-*\/^])\s?(\d+))?$/

const entryRegex = ALLOW_EQUATIONS ? withEquation : withoutEquation

interface ProcessedEquation {
    original: string
    result: number
    isEquation: boolean
    isBroken: boolean
}

export const dontPingUser = {
    allowedMentions: {
        repliedUser: false,
    },
} as MessageReplyOptions

export const processEntry = (
    value: string,
    returnResults = false,
): RegExpExecArray | boolean => {
    switch (returnResults) {
        case true:
            const res = entryRegex.exec(value)
            return res !== null ? res : false
        default:
            return entryRegex.test(value)
    }
}

export const processEquation = (
    value: string,
): ProcessedEquation | undefined => {
    const matches = processEntry(value, true) as RegExpExecArray
    if (!matches) return undefined
    if (!(matches[2] && matches[3]))
        return {
            original: value,
            result: Number(matches[1]),
            isEquation: false,
            isBroken: false,
        }
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
    if (ret === Infinity || isNaN(ret))
        return {
            isBroken: true,
            isEquation: true,
            result: 0,
            original: value,
        }
    return {
        isBroken: false,
        isEquation: true,
        result: Math.abs(ret),
        original: value,
    }
}

export const applyPunishment = async (user: GuildMember, time: number) => {
    const timeoutRole = user.guild.roles.cache.find(r => r.id === TIMEOUT_ROLE)
    if (!timeoutRole) throw new Error('Unable to find a valid timeout role.')
    await user.roles.add(timeoutRole)
    await sleep(time * 12 * 3600)
    await user.roles.remove(timeoutRole)
}

export const isMessageInvalid = (message: Message<boolean> | PartialMessage) =>
    (message.author && message.author.bot) ||
    !message.content ||
    message.channel.id !== COUNTING_CHANNEL
