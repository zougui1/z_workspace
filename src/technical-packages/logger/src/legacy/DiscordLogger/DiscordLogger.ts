import Discord from 'discord.js';
import moment from 'moment';
import { threadList } from '@zougui/thread-list';

import { formatMessage } from './formatMessage';
import { BaseTransportLogger } from '../BaseTransportLogger';
import { ILoggerOptions } from '../types';
import { LogLevel } from '../LogLevel';
import { LogKind } from '../LogKind';
import { ILogObject } from '../log-utils/LogV2';
import { DiscordLogConfig } from '../types/logger-config-types';

export class DiscordLogger extends BaseTransportLogger<DiscordLogConfig> {

  private readonly _client: Discord.Client = new Discord.Client();
  private _messages: { embed: Discord.MessageEmbed, logId: string, log: ILogObject }[] = [];
  private _ready: boolean = false;
  private _logsServer?: Discord.Guild;
  private _logsChannel?: Discord.TextChannel;

  constructor(config: DiscordLogConfig, options: ILoggerOptions = {}) {
    super(config, {
      ...options,
      name: 'discord',
    });

    this.init();
    this._client.login(config.token);
  }

  //#region logging
  protected async print(level: LogLevel, log: ILogObject, logId: string): Promise<void> {
    const embed = this.getMessageEmbed(level, log);

    if (this._ready) {
      this.send(embed, log, logId);
    } else {
      this._messages.push({ embed, logId, log });
    }
  }
  //#endregion

  //#region helpers
  protected async send(message: Discord.MessageEmbed, log: ILogObject, logId: string): Promise<void> {
    const options = log.getOption(LogKind.discord);

    const logServer = this._client.guilds.cache.find(server => server.name === options?.server);
    const categories = logServer?.channels.cache.filter(channel => channel.type === 'category').array() as Discord.CategoryChannel[];

    const logCategory = categories.find(channel => channel.name === options?.category);

    const channels = logCategory
      ? logCategory.children.filter(channel => channel.type === 'text').array() as Discord.TextChannel[]
      : logServer?.channels.cache.filter(channel => channel.type === 'text').array() as Discord.TextChannel[];

    const serverChannel = channels?.find(channel => channel.name === options?.channel);
    let logChannel = serverChannel;

    if (logServer && !logChannel && options?.channel && options?.ensureChannel) {
      logChannel = await logServer.channels.create(options.channel, { parent: logCategory });
    }

    logChannel ??= this._logsChannel;

    try {
      await logChannel?.send(message);
    } catch (error) {
      console.error('failed to log to discord', error);
    } finally {
      this.emit('logged', logId);
    }
  }

  protected getMessageEmbed(level: LogLevel, log: ILogObject): Discord.MessageEmbed {
    const dirtyMessage = log.getMessage();
    const time = log.getTime();

    let message = formatMessage(dirtyMessage);

    const embed = new Discord.MessageEmbed()
      .setColor(this._config[level].color)
      .setTitle(level.toUpperCase())
      .setDescription(message)
      .addField('Logged at:', moment(time.createdAt).format(time.format))
      .setTimestamp();

    if (this._options.logFile) {
      embed.addField('For more details see:', this._options.logFile);
    }

    return embed;
  }
  //#endregion

  //#region private
  private init(): void {
    this._client.on('disconnect', () => {
      this._ready = false;
      this._client.login(this._config.token);
    });

    this._client.on('ready', async () => {
      this._ready = true;

      this._logsServer = this._client.guilds.cache.find(guild => {
        return guild.name === this._config.server;
      });

      const channel = this._logsServer?.channels.cache.array()[0];
      this._logsChannel = channel?.type === 'text' ? channel as Discord.TextChannel : undefined;

      this.flush();
    });

    threadList.addCleanup(() => {
      this._client.destroy();
    });
  }

  private flush(): void {
    for (const message of this._messages) {
      this.send(message.embed, message.log, message.logId);
    }
  }
  //#endregion
}
