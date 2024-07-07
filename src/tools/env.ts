import dotenv from 'dotenv'

// ENV VARS INIT
dotenv.config()
const TOKEN = process.env['DISCORD_TOKEN'] ?? ''
if (!TOKEN) throw new Error('No token found.')
const CLIENT = process.env['DISCORD_CLIENT_ID'] ?? ''
if (!CLIENT) throw new Error('No client found.')
const DEBUG = (process.env['DEBUG_MODE'] ?? '0') === '1'
const CHANNEL = process.env['COUNTING_CHANNEL'] ?? ''
if (!CHANNEL) throw new Error('No channel found.')
const TIMEOUT_ROLE = process.env['TIMEOUT_ROLE'] ?? ''
const MOD_ROLES = (process.env['MOD_ROLES'] ?? '').split('+')
const GUILD = process.env['GUILD_ID'] ?? ''

export { TOKEN, CLIENT, DEBUG, CHANNEL, TIMEOUT_ROLE, MOD_ROLES, GUILD }
