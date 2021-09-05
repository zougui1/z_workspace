import path from 'path';

import { Context, HttpResponseOK, isHttpResponseOK, Hook, HttpResponse } from '@foal/core';
import sharp from 'sharp';

import { readFile, writeFile } from '@zougui/fs';
import { getSafeNumber } from '@zougui/utils';

import { FilePathState } from './GetFilePath';
import { stringifyFilters, sanitizeFilters, checkFileState } from '../utils';

export const SendTransformedFile = () => Hook(async (ctx: Context<any, any, FilePathState>) => {
  const { dir, fileName } = ctx.state;
  const { query } = ctx.request;
  const { format } = query;

  checkFileState(ctx.state);

  const width = getSafeNumber(query.width);
  const height = getSafeNumber(query.height);
  const quality = getSafeNumber(query.quality);

  const filters = sanitizeFilters({ width, height, quality });

  const dirPath = path.join(dir, 'filters', stringifyFilters(filters));
  const transformedImagePath = path.join(dirPath, fileName);

  const res = await readFile(transformedImagePath).catch(() => {});

  if (res) {
    return new HttpResponseOK(res.file);
  }

  return async response => {
    await transformFile(response, transformedImagePath, { ...filters, format });
  }
});

const transformFile = async (response: HttpResponse, path: string, filters: Filters): Promise<void> => {
  if (!isHttpResponseOK(response) || !(response.body instanceof Buffer)) {
    return;
  }

  const image = await sharp(response.body)
    .resize(filters.width, filters.height)
    .toFormat(filters.format || 'jpg', { quality: filters.quality })
    .toBuffer();

  await writeFile(path, image, { ensureDir: true });

  response.body = image;
}

interface Filters {
  width?: number;
  height?: number;
  quality?: number;
  format?: keyof sharp.FormatEnum | sharp.AvailableFormatInfo;
}
