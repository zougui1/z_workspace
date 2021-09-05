import crypto from 'crypto';

import { Context, Get, HttpResponseOK, HttpResponseUnauthorized, Hook } from '@foal/core';
import ms from 'ms';
//import { JWTRequired } from '@foal/jwt';

import { readFile } from '@zougui/fs';
import { GetFilePath, FilePathData, FilePathState, SendTransformedFile } from '@zougui/server-storage';

import { FILE_STORAGE_SIGNATURE_KEY } from '../../../../env';

const SignedUrl = () => {
  return Hook(ctx => {
    const { expires, signature } = ctx.request.query;

    console.log('path', ctx.request.path)

    const signatureData = {
      url: ctx.request.path,
      expires: +expires,
      key: FILE_STORAGE_SIGNATURE_KEY,
    };

    const currentSignature = crypto.createHash('sha256').update(JSON.stringify(signatureData)).digest('hex');

    if (currentSignature !== signature) {
      return new HttpResponseUnauthorized();
    }

    if (Date.now() > (+expires)) {
      return new HttpResponseUnauthorized();
    }
  });
}

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
  //@JWTRequired()
  @GetFilePath(getUserFilesDir)
  @SignedUrl()
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

  @Get('/sign-url')
  async signUrl(ctx: Context) {
    const { url } = ctx.request.query;
    const expires = Date.now() + ms('10s');

    const signatureData = {
      url,
      expires,
      key: FILE_STORAGE_SIGNATURE_KEY,
    };

    const signature = crypto.createHash('sha256').update(JSON.stringify(signatureData)).digest('hex');

    return new HttpResponseOK({ expires, signature });
  }
}
