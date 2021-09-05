// @ts-nocheck
import { AbilityBuilder, Ability } from '@casl/ability';

import { loginActivity, permission, role, user, userPlatform } from './models';

(async () => {
  /*const perm = await permission.Model.query().insert({
    name: 'doSomething',
    ability: 'can',
    actions: JSON.stringify(['read']),
    subjects: JSON.stringify(['Music']),
  });

  const rle = await role.Model.query().insert({
    name: 'engineer',
    permissions: JSON.stringify([]),
  });

  await role.Model.relatedQuery('permissions').for(rle.id).relate([perm.id]);

  const usr = await user.Model.query().insert({
    name: 'zougui',
    password: 'mypass',
    email: 'zougui@gmail.com',
    loginHistory: JSON.stringify([]),
    roles: JSON.stringify([]),
    permissions: JSON.stringify([]),
    platforms: JSON.stringify([]),
  });

  await user.Model.relatedQuery('roles').for(rle.id).relate([perm.id]);*/

  const usr = await user.Model
    .query()
    .select()
    .where('id', 1)
    .withGraphFetched('roles')
    .withGraphFetched('roles.permissions')
    .withGraphFetched('permissions')
    .withGraphFetched('platforms')
    .first();

  console.log(usr);

  if (!usr) {
    return;
  }

  console.log(usr.roles[0].permissions)

  const defineUserAbilitiesFor = (user: any) => {
    const { can, cannot, rules } = new AbilityBuilder(Ability);

    // the user can do anything with their own music
    // but nothing with others' music

    for (const role of user.roles) {
      for (const permission of role.permissions) {
        if (permission.ability === 'can') {
          can(permission.actions, permission.subjects);
        } else if (permission.ability === 'cannot') {
          cannot(permission.actions, permission.subjects);
        }
      }
    }
    //can('manage', 'Music', { owner: user.id });
    //can('read', 'Music', ['id'], { owner: user.id })

    return new Ability(rules);
  }

  const ability = defineUserAbilitiesFor(usr);

  const music = {
    user: usr.id,
    title: 'Wild und Frei',
  };

  console.log(`Can ${usr.name} read a music?`, ability.can('read', 'Music'));
  /*const activity = await loginActivity.Model.query().insert({
    city: 'ormoy',
    country: 'france',
  })*/
})();

const crypto = require('crypto');

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
      modulusLength: 8192,
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

const encrypt = async (password) => {
  const iv = crypto.randomBytes(12);
  console.log('iv', iv.toString('hex'))

  const cipher = crypto.createCipheriv('aes-256-gcm', hashPassword(password), iv);

  const safeIv = crypto.randomBytes(32);
  //const safeCipher = crypto.createCipheriv('aes-256-ctr', hashPassword(process.env.PRIVATE_KEY), safeIv);

  //? maybe hash the password before?
  const { publicKey, privateKey } = await generateKeyPair(password);

  console.log('privateKey', privateKey)

  const encryptedPrivate = Buffer.concat([cipher.update(privateKey), cipher.final(), cipher.getAuthTag(), iv]).toString('hex');

  return encryptedPrivate;
}

const decrypt = async (encrypted, password) => {
  const encryptedBuffer = Buffer.from(encrypted, 'hex')
  const encryptedData = encryptedBuffer.slice(0, -28);
  const authTag = encryptedBuffer.slice(-28, -12);
  const iv = encryptedBuffer.slice(-12);

  console.log('iv, from encrypted', iv.toString('hex'))

  const decipher = crypto.createDecipheriv('aes-256-gcm', hashPassword(password), iv).setAuthTag(authTag);

  const data = Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();

  return data;
}

(async () => {
  console.group('encrypt');
  const encrypted = await encrypt(user.encryptionPassword);
  //console.log('encrypted', encrypted)
  console.groupEnd();

  console.group('decrypt');
  const decrypted = await decrypt(encrypted, user.encryptionPassword);
  console.log('decrypted', decrypted)
  console.groupEnd();
})()
