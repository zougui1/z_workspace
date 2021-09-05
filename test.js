const os = require('os');
const crypto = require('crypto');
const argon2 = require('argon2');
const prettyBytes = require('pretty-bytes');
const prettyMs = require('pretty-ms');

class Stopwatch {

  //#region properties
  _start;
  _current;
  timings = {};
  //#endregion

  //#region methods
  start() {
    this._start = this._current = process.hrtime();
    return this;
  }

  lap(label) {
    if (!this._current) {
      throw new Error('The stopwatch can only lap when running.');
    }

    const hrtime = process.hrtime(this._current);
    this._current = process.hrtime();
    this.timings[label] = this.getMilliseconds(hrtime);

    return this;
  }

  stop(options) {
    if (!this._start) {
      throw new Error('The stopwatch can only stop when running.');
    }

    this.timings.total = this.getMilliseconds(process.hrtime(this._start));

    if (options?.raw) {
      return this.timings;
    }

    const formattedTimings = Object.entries(this.timings).reduce((timings, [key, timing]) => {
      timings[key] = prettyMs(timing, { millisecondsDecimalDigits: 5 });
      return timings;
    }, {});

    return formattedTimings;
  }
  //#endregion

  //#region private methods
  getMilliseconds([seconds, nanoseconds]) {
    return (seconds * 1000) + (nanoseconds / 1e+6);
  }
  //#endregion
}


const user = {
  encryptionPassword: 'my-password',
}

process.env.PASSWORD_SALT_LEFT = 'PASSWORD_SALT_LEFT';
process.env.PASSWORD_SALT_RIGHT = 'PASSWORD_SALT_RIGHT';
process.env.PRIVATE_KEY = 'PRIVATE_KEY';

const hashPassword = (password) => {
  // the salts have to be consistent
  const saltedPassword = `${process.env.PASSWORD_SALT_LEFT}${password}${process.env.PASSWORD_SALT_RIGHT}`;
  return crypto.createHash('sha256').update(saltedPassword).digest();
}

const generateKeyPair = (password) => {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 512,
      publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-ofb',
        passphrase: password
      }
    }, (err, publicKey, privateKey) => {
      if (err) {
        return reject(err);
      }

      resolve({ publicKey, privateKey });
    });
  });
}

const MEMORY_COST = 4096 * 240;
const ITERATIONS = 2;
const PARALLELISM = 32;
const SALT_LENGTH = 64;
const HASH_LENGTH = 256;
const IV_LENGTH = 64;

const deriveKey = async (password, salt) => {
  return await argon2.hash(password, {
    memoryCost: MEMORY_COST,
    parallelism: PARALLELISM,
    hashLength: HASH_LENGTH,
    timeCost: ITERATIONS,
    salt,
  });
}

const testArgon2Timing = async (password, options) => {
  const iter = 3;
  const timings = [];

  // make Javascript optimize those functions
  new Stopwatch().start().stop();

  for (let i = iter; i; i--) {
    const timer = new Stopwatch().start();
    await argon2.hash(password, options);
    timer.stop();

    timings.push(timer.timings.total);
  }

  const averageMilliseconds = timings.reduce((acc, cur) => acc + cur, 0) / timings.length;
  return averageMilliseconds;
}

const findArgon2Params = async () => {
  const plainText = 'password';
  let memoryCost = 2048;
  let timeCost = 2;
  const parallelism = os.cpus().length * 2;
  const saltLength = 64;
  const hashLength = 256;

  const salt = crypto.randomBytes(saltLength);

  const maxTime = 500;
  const minThreshold = maxTime * 0.96;
  const maxThreshold = maxTime * 1.04;

  let timing = 0;

  console.log('\nfind recommended memory cost\n');

  const isShorterThanExpected = (timing) => {
    return (timing - minThreshold) < maxTime;
  }

  const isShorterThanAccepted = (timing) => {
    return timing <= minThreshold;
  }

  const isLongerThanAccepted = (timing) => {
    return timing >= maxThreshold;
  }

  const isAcceptedTiming = (timing) => {
    return !isShorterThanAccepted(timing) && !isLongerThanAccepted(timing);
  }

  const getNewdMemoryCost = (memoryCost, timing) => {
    const minUpdateNum = 0.001;

    if (timing <= 0) {
      return memoryCost;
    }

    if (isShorterThanExpected(timing)) {
      return memoryCost * Math.max(minUpdateNum, maxTime / timing);
    }

    return memoryCost / Math.max(minUpdateNum, timing / maxTime);
  }

  const showTime = (timing) => {
    console.log('average time:', prettyMs(timing));

    if (timing < minThreshold) {
      console.log('too low');
    } else if (timing > maxThreshold) {
      console.log('too high');
    } else {
      console.log('ok');
    }
  }

  const hash = async (options = {}) => {
    return await testArgon2Timing(plainText, {
      memoryCost,
      parallelism,
      hashLength,
      timeCost,
      salt,
      ...options,
    });
  }

  const performHash = async (options) => {
    timing = await hash(options);
    showTime(timing);
    console.log();
  }

  while (!isAcceptedTiming(timing)) {
    const newMemoryCost = Math.round(getNewdMemoryCost(memoryCost, timing));

    if ((timing !== 0 && newMemoryCost === memoryCost) || newMemoryCost < 2048) {
      console.log('can no longer change the memory cost:', prettyBytes(memoryCost * 1000));
      break;
    }

    memoryCost = newMemoryCost;
    console.log('memory cost:', prettyBytes(newMemoryCost * 1000));

    await performHash({ memoryCost: newMemoryCost });
  }

  if (timing < maxTime) {
    console.log('\nfind recommended time cost\n');

    do {
      const newTimeCost = timing < maxTime
        ? timeCost + 1
        : timeCost - 1;

      if (newTimeCost < 2) {
        console.log('the time cost cannot be less than 2');
        break;
      }

      timeCost = newTimeCost;
      console.log('time cost:', newTimeCost);

      await performHash({ timeCost: newTimeCost });
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

const printObject = (object) => {
  for (const [name, value] of Object.entries(object)) {
    console.log(`${name}: ${value}`);
  }
}

(async () => {
  const params = await findArgon2Params();

  console.log('recommended parameters:');
  printObject(params);
})();

const encrypt = async (password, data) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  //console.log('iv', iv.toString('hex'))

  console.time('hash')
  const hashedPassword = await deriveKey(password, salt);
  console.timeEnd('hash')
  const derivedKey = hashPassword(await deriveKey(password, salt));

  const cipher = crypto.createCipheriv('aes-256-gcm', derivedKey, iv);

  //const safeIv = crypto.randomBytes(32);
  //const safeCipher = crypto.createCipheriv('aes-256-ctr', hashPassword(process.env.PRIVATE_KEY), safeIv);

  const encryptedPrivate = Buffer.concat([cipher.update(data), cipher.final(), cipher.getAuthTag(), iv, salt]).toString('hex');

  return encryptedPrivate;
}

const decrypt = async (encrypted, password) => {
  const startAuthTag = -(16 + IV_LENGTH + SALT_LENGTH);
  const startIv = -(IV_LENGTH + SALT_LENGTH);
  const startSalt = -SALT_LENGTH;

  const encryptedBuffer = Buffer.from(encrypted, 'hex')
  const encryptedData = encryptedBuffer.slice(0, startAuthTag);
  const authTag = encryptedBuffer.slice(startAuthTag, startIv);
  const iv = encryptedBuffer.slice(startIv, startSalt);
  const salt = encryptedBuffer.slice(startSalt);

  //console.log('iv, from encrypted', iv.toString('hex'))

  const derivedKey = hashPassword(await deriveKey(password, salt));
  const decipher = crypto.createDecipheriv('aes-256-gcm', derivedKey, iv).setAuthTag(authTag);

  const data = Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();

  return data;
}

(async () => {
  console.group('encrypt');
  const encrypted = await encrypt(user.encryptionPassword, 'some data');
  //console.log('encrypted', encrypted)
  console.groupEnd();

  console.group('decrypt');
  const decrypted = await decrypt(encrypted, user.encryptionPassword);
  console.log('decrypted', decrypted)
  console.groupEnd();
})
