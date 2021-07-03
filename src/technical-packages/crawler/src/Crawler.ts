import CheerioCrawler from 'crawler';
import { EventEmitter } from 'events';
import _ from 'lodash';
import { stripHtml } from 'string-strip-html'

import { Queue } from './Queue';
import { Element } from './Element'

export class Crawler extends EventEmitter {

  protected crawler: CheerioCrawler;
  protected queuedUrl?: string;
  protected executors: ((body: Element) => void)[] = [];
  protected _options: CrawlerOptions;
  private queue: Queue;

  constructor(options: CrawlerOptions = {}) {
    super();

    this._options = options;

    this.crawler = new CheerioCrawler({
      ...options,
      callback: this.crawlerCallback.bind(this),
    });

    this.queue = new Queue({ throttle: options.throttle });
  }

  async goto(url: string): Promise<Element> {
    return await this.queue.wait(() => {
      this.crawler.queue(url);

      return new Promise<Element>((resolve, reject) => {
        const cleanup = () => {
          this.off('parsed', onParsed);
          this.off('error', onError);
        }

        const onParsed = (body: Element) => {
          cleanup();
          resolve(body);
        }
        const onError = (error: Error) => {
          cleanup();
          reject(error);
        }

        this.once('parsed', onParsed);
        this.once('error', onError);
      });
    });
  }

  //#region protected
  protected crawlerCallback(err: Error, res: CheerioCrawler.CrawlerRequestResponse, done: () => void): void {
    if (err) {
      this.emit('error', err);
      return;
    }

    //const reScriptTags = /<script([a-z0-9\n\s,\\\/])*>([a-z0-9\n\s])*<\/script>/gi;
    const fs = require('fs');
    const pretty = require('pretty');
    //const striptags = require('string-strip-html');
    const cleanHtml = stripHtml(res.body.toString(), {
      onlyStripTags: ['script', 'meta', 'title', 'link', 'head'],
      //stripTogetherWithTheirContents: ['script', 'head'],

    })
    fs.writeFileSync(__dirname + '/../src/res.html', pretty(cleanHtml.result).replace(/\n{3,}/g, '\n'));

    const [body] = res.$('body').toArray();

    if (!body || body.type !== 'tag') {
      this.emit('error', new Error('No <body> tag found.'));
      return;
    }

    this.emit('parsed', new Element(body));

    done();
  }
  //#endregion
}

export interface CrawlerOptions {
  autoWindowClose?: boolean;
  forceUTF8?: boolean;
  gzip?: boolean;
  incomingEncoding?: string;
  jquery?: any;
  jQuery?: any;
  maxConnections?: number;
  method?: string;
  priority?: number;
  priorityRange?: number;
  rateLimit?: number;
  referer?: false | string;
  retries?: number;
  retryTimeout?: number;
  timeout?: number;
  skipDuplicates?: boolean;
  rotateUA?: boolean;
  userAgent?: string | string[];
  homogeneous?: boolean;
  http2?: boolean;
  debug?: boolean;
  throttle?: number;
  logger?: {
      log: (level: string, ...args: ReadonlyArray<any>) => void;
  };
  seenreq?: any;
  headers?: CheerioCrawler.Headers;
  preRequest?: (options: CheerioCrawler.CrawlerRequestOptions, doRequest: (err?: Error) => void) => void;
  [x: string]: any;
}
