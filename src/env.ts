import dotenv from "dotenv";

// ENV VARS INIT
dotenv.config()
const TOKEN = process.env['DISCORD_TOKEN'] ?? ''
if (!TOKEN)
    throw new Error()
let CLIENT = process.env['DISCORD_CLIENT_ID'] ?? ''
if (!CLIENT)
    throw new Error()
let DEBUG = (process.env['DEBUG_MODE'] ?? '0') === '1'
let CHANNEL = process.env['COUNTING_CHANNEL'] ?? ''
if (!CHANNEL)
    throw new Error()
let TIMEOUT_ROLE = process.env['TIMEOUT_ROLE'] ?? ''
let MOD_ROLES = (process.env['MOD_ROLES'] ?? '').split('+')
let GUILD = process.env['GUILD_ID'] ?? ''

export {TOKEN, CLIENT, DEBUG, CHANNEL, TIMEOUT_ROLE, MOD_ROLES, GUILD}
