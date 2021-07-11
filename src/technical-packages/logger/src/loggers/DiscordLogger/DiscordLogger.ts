import Discord from 'discord.js';
import _ from 'lodash';
import moment from 'moment';
import { PartialDeep } from 'type-fest';

import { threadList } from '@zougui/thread-list';

import { BaseLogger } from '../BaseLogger';
import { LoggerConfig, LoggerDiscordConfig } from '../../config';
import { ILog } from '../../log';
import { LogColor } from '../../enums';
import { getLogFile } from '../../utils';

export class DiscordLogger extends BaseLogger<LoggerDiscordConfig> {

  private readonly _client: Discord.Client = new Discord.Client();
  private _messages: { embed: Discord.MessageEmbed, log: ILog, logConfig: LoggerConfig }[] = [];
  private _ready: boolean = false;
  private _logsServer?: Discord.Guild;
  private _logsChannel?: Discord.TextChannel;
  private _logFile: string | undefined;

  constructor(fullConfig: LoggerConfig, config: LoggerDiscordConfig) {
    super('discord', fullConfig, config);

    this._logFile = getLogFile(fullConfig);

    this.init();
    this._client.login(config.token);
  }

  //#region logging
  protected async print(log: ILog, logConfig: LoggerConfig): Promise<void> {
    const embed = this.getMessageEmbed(log);

    if (this._ready) {
      this.send(embed, log, logConfig);
    } else {
      this._messages.push({ embed, log, logConfig });
    }
  }
  //#endregion

  //#region helpers
  protected async send(message: Discord.MessageEmbed, log: ILog, logConfig?: PartialDeep<LoggerConfig>): Promise<void> {
    const options = logConfig?.discord;

    const logServer = this._client.guilds.cache.find(server => server.name === options?.server);
    const categories = logServer?.channels.cache.filter(channel => channel.type === 'category').array() as Discord.CategoryChannel[];

    const logCategory = categories?.find(channel => channel.name === options?.category);

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
      throw error;
    } finally {
      this.emit('logged', log.logId);
    }
  }

  protected getMessageEmbed(log: ILog): Discord.MessageEmbed {

    const embed = new Discord.MessageEmbed()
      .setColor(LogColor[log.level])
      .setTitle(log.level.toUpperCase())
      .setDescription(log.message)
      .addField('Logged at:', moment(log.time.createdAt).format(log.time.format))
      .setTimestamp();

    if (this._logFile) {
      embed.addField('For more details see:', this._logFile);
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
      this.send(message.embed, message.log, message.logConfig);
    }
  }
  //#endregion
}
