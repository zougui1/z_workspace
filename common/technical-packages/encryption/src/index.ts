import { encrypt } from './encrypt';
import { decrypt } from './decrypt';
export * from './encrypt';
export * from './decrypt';

const hashTime = '0.1s';
const password = 'pass';
const plainData = 'some data';
const saltLeft = 'saltLeft';
const saltRight = 'saltRight';

(async () => {
  console.log('plain data:', plainData);
  console.log('password:', password);
  console.log('-'.repeat(70));

  console.group('encrypt');
  const encrypted = await encrypt(plainData, password, { hashTime, saltLeft, saltRight });
  console.log('encrypted', encrypted);
  console.groupEnd();

  console.group('decrypt');
  const decrypted = await decrypt(encrypted, password, { hashTime, saltLeft, saltRight });
  console.log('decrypted', decrypted)
  console.groupEnd();
});
