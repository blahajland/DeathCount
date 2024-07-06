import {CommandInteraction, REST, Routes, SlashCommandBuilder} from "discord.js";
import {CLIENT, GUILD, TOKEN} from "../env";
import {assertIsMod} from "../tools/mods";
import {directoryImport} from 'directory-import';

export type DiscordEventHandler = (interaction: CommandInteraction) => Promise<void>

export enum DiscordUserPermission {
    USER,
    ADMIN
}

export enum DiscordOptionType {
    STRING,
    NUMBER,
    USER,
    BOOLEAN,
    ROLE,
    CHANNEL,
    CHOICES
}

export interface DiscordChoice {
    name: string,
    value: string
}

export interface DiscordOption {
    name: string
    description?: string
    type: DiscordOptionType
    required: boolean
    min?: number
    max?: number
    choices?: Array<DiscordChoice>
}

export interface DiscordCommand {
    name: string,
    description: string,
    permissions: DiscordUserPermission,
    options: Array<DiscordOption>,
    handler: DiscordEventHandler
}

interface DiscordInternalCommand {
    data: SlashCommandBuilder,
    execute: DiscordEventHandler
}

export const commands = new Map<string, DiscordInternalCommand>()

export const addDiscordCommand = (command: DiscordCommand) => {
    if (command.name === '')
        throw new Error('This command can\'t be called')
    const data = new SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
    command.options.forEach((c) => assignOptions(data, c))
    const execute = async (interaction: CommandInteraction) => {
        if (command.permissions === DiscordUserPermission.ADMIN)
            if (!await assertIsMod(interaction)) return
        await command.handler(interaction)
    }
    const internal = {
        data: data,
        execute: execute
    }
    commands.set(command.name, internal)
    return internal
}

const assignOptions = (builder: SlashCommandBuilder, option: DiscordOption) => {
    switch (option.type) {
        case DiscordOptionType.STRING:
            builder.addStringOption((o) =>
                o.setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required))
            break
        case DiscordOptionType.BOOLEAN:
            builder.addBooleanOption((o) => o.setName(option.name)
                .setDescription(option.description ?? option.name)
                .setRequired(option.required))
            break
        case DiscordOptionType.CHANNEL:
            builder.addChannelOption((o) => o.setName(option.name)
                .setDescription(option.description ?? option.name)
                .setRequired(option.required))
            break
        case DiscordOptionType.CHOICES:
            builder.addStringOption((o) => {
                o.setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required)
                    .setAutocomplete(true)
                if (option.choices)
                    o.addChoices(...option.choices)
                return o
            })
            break
        case DiscordOptionType.NUMBER:
            builder.addNumberOption((o) => {
                o.setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required)
                if (option.min)
                    o.setMinValue(option.min)
                if (option.max)
                    o.setMaxValue(option.max)
                return o
            })
            break
        case DiscordOptionType.ROLE:
            builder.addRoleOption((o) =>
                o.setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required))
            break
        case DiscordOptionType.USER:
            builder.addUserOption((o) =>
                o.setName(option.name)
                    .setDescription(option.description ?? option.name)
                    .setRequired(option.required))
            break
        default:
            throw new Error()
    }
}

export const syncDiscordCommands = async () => {
    const commands = directoryImport('../commands/')
    const rest = new REST({version: '10'}).setToken(TOKEN);
    const commandsAsBody: Array<Object> = []
    for (let e in commands) {
        // @ts-ignore
        const command = commands[e].default as DiscordCommand
        commandsAsBody.push(addDiscordCommand(command).data.toJSON())
    }
    try {
        console.log('Started refreshing application (/) commands.');
        const data = await rest.put(Routes.applicationGuildCommands(CLIENT, GUILD), {body: commandsAsBody}) as Array<any>;
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
}