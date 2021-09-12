import { Context, Get, HttpResponseOK } from '@foal/core';

import { readFile } from '@zougui/fs';
import { UrlSignatureRequired } from '@zougui/server-security';
import { GetFilePath, FilePathData, FilePathState, SendTransformedFile } from '@zougui/server-storage';

import { PORT } from '../../../../env';

const getUserFilesDir = (ctx: Context): FilePathData => {
  const { userId, category, fileName } = ctx.request.params;

  return {
    dirParts: ['users', userId, category],
    fileName,
  };
}

const getPublicFilesDir = (ctx: Context): FilePathData => {
  const { category, fileName } = ctx.request.params;

  return {
    dirParts: ['public', category],
    fileName,
  };
}

export class FileController {

  @Get('/users/:userId/:category/:fileName')
  @UrlSignatureRequired({ port: PORT })
  /*@AutoSigningUrl()
  @UrlSignatureRequired()*/
  @GetFilePath(getUserFilesDir)
  @SendTransformedFile()
  async userFile(ctx: Context<any, any, FilePathState>) {
    console.log('http', ctx.request.secure)

    const { file } = await readFile(ctx.state.file);
    return new HttpResponseOK(file);
  }

  @Get('/public/:category/:fileName')
  @GetFilePath(getPublicFilesDir)
  @SendTransformedFile()
  async publicFile(ctx: Context<any, any, FilePathState>) {
    const { file } = await readFile(ctx.state.file);
    return new HttpResponseOK(file);
  }
}
