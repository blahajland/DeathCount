import configFile from '../../config.json'

const TOKEN = configFile.discordToken ?? ''
if (!TOKEN) throw new Error('No token found.')

const DISCORD_CLIENT_ID = configFile.discordClientId ?? ''
if (!DISCORD_CLIENT_ID) throw new Error('No client found.')

const DEBUG_MODE = configFile.debugMode ?? false

const COUNTING_CHANNEL = configFile.countingChannel ?? ''
if (!COUNTING_CHANNEL) throw new Error('No channel found.')

const TIMEOUT_ROLE = configFile.timeoutRole ?? ''

const MOD_ROLES = configFile.modRoles ?? []

const GUILD_ID = configFile.guildId ?? ''
if (!GUILD_ID) throw new Error('No guild ID found.')

const UPDATE_PROMPT = (configFile.updatePrompt ?? 0) % 3
// 0 : ask, 1 : yes, 2 : no

const ALLOW_EQUATIONS = configFile.allowEquations ?? false

export {
    TOKEN,
    DISCORD_CLIENT_ID,
    DEBUG_MODE,
    COUNTING_CHANNEL,
    TIMEOUT_ROLE,
    MOD_ROLES,
    GUILD_ID,
    UPDATE_PROMPT,
    ALLOW_EQUATIONS,
}
