import crypto from 'crypto';
import os from 'os';

import ms from 'ms';
import { hash, Options } from 'argon2';

import { Stopwatch } from '@zougui/stopwatch';

const ITERATIONS = 3;
const PLAIN_TEXT = 'some plain text';

// cache for the hash params based on the hash time
const hashParams: Record<string, Options> = {};

/**
 * @param hashTime
 * find the params required for the hash algorithm to take `hashTime` to make the hash
 */
export const findHashParams = async (hashTime: number | string): Promise<Options> => {
  const hashTimeMilliseconds = typeof hashTime === 'number' ? hashTime : ms(hashTime);

  return hashParams[hashTimeMilliseconds] ??= await performFindHashParams(hashTimeMilliseconds);
}

// TODO catch potential errors thrown by the hash function
const performFindHashParams = async (hashTime: number): Promise<Options> => {
  let memoryCost = 2048;
  let timeCost = 2;
  const parallelism = os.cpus().length * 2;
  const saltLength = 64;
  const hashLength = 256;

  const salt = crypto.randomBytes(saltLength);

  const minThreshold = hashTime * 0.96;
  const maxThreshold = hashTime * 1.04;

  let timing = 0;

  const isShorterThanExpected = (timing: number): boolean => {
    return (timing - minThreshold) < hashTime;
  }

  const isShorterThanAccepted = (timing: number): boolean => {
    return timing <= minThreshold;
  }

  const isLongerThanAccepted = (timing: number): boolean => {
    return timing >= maxThreshold;
  }

  const isAcceptedTiming = (timing: number): boolean => {
    return !isShorterThanAccepted(timing) && !isLongerThanAccepted(timing);
  }

  const getNewdMemoryCost = (memoryCost: number, timing: number): number => {
    const minUpdateNum = 0.001;

    if (timing <= 0) {
      return memoryCost;
    }

    if (isShorterThanExpected(timing)) {
      return memoryCost * Math.max(minUpdateNum, hashTime / timing);
    }

    return memoryCost / Math.max(minUpdateNum, timing / hashTime);
  }

  const hash = async (options: { memoryCost?: number; timeCost?: number } = {}): Promise<number> => {
    return await testArgon2Timing(PLAIN_TEXT, {
      memoryCost,
      parallelism,
      hashLength,
      timeCost,
      salt,
      ...options,
    });
  }

  while (!isAcceptedTiming(timing)) {
    const newMemoryCost = Math.round(getNewdMemoryCost(memoryCost, timing));

    if ((timing !== 0 && newMemoryCost === memoryCost) || newMemoryCost < 2048) {
      break;
    }

    memoryCost = newMemoryCost;
    timing = await hash({ memoryCost: newMemoryCost });
  }

  if (timing < hashTime) {

    do {
      const newTimeCost = timing < hashTime
        ? timeCost + 1
        : timeCost - 1;

      if (newTimeCost < 2) {
        break;
      }

      timeCost = newTimeCost;
      timing = await hash({ timeCost: newTimeCost });
    } while (!isAcceptedTiming(timing));
  }

  return {
    memoryCost,
    parallelism,
    hashLength,
    timeCost,
    saltLength,
  };
}

const testArgon2Timing = async (password: string | Buffer, options?: Options & { raw?: false }): Promise<number> => {
  const timings = [];

  // make Javascript optimize those functions
  new Stopwatch().start().stop();

  for (let i = ITERATIONS; i; i--) {
    const timer = new Stopwatch().start();
    await hash(password, options);
    timer.stop();

    timings.push(timer.timings.total);
  }

  const averageMilliseconds = timings.reduce((acc, cur) => acc + cur, 0) / timings.length;
  return averageMilliseconds;
}
