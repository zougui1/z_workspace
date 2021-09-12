import { Context, Post, Get, HttpResponseOK, HttpResponseUnauthorized, HttpResponseNotFound, HttpResponse, HttpResponseNoContent } from '@foal/core';
import { JWTRequired, setAuthCookie } from '@foal/jwt';
import { AbilityBuilder, Ability } from '@casl/ability';

import { user } from '@user-service/user-database';

import { HttpsOnly, signUrl, checkSignature } from '@zougui/server-security';
import { ValidateQuery } from '@zougui/server-validation';
import { sign, decode } from '@zougui/jwt';

import { signUrlQuerySchema, checkSignedUrlQuerySchema } from './schemas';
import { URL_SIGNATURE_KEY } from '../../env';

const defineUserAbilitiesFor = (user: any) => {
  const { can, rules } = new AbilityBuilder(Ability);

  // the user can do anything with their own music
  // but nothing with others' music
  can('manage', 'Music', { owner: user.id });

  return new Ability(rules);
}

export class AuthController {

  @Post('/signup')
  async index(ctx: Context) {
    await user.create(ctx.request.body);
    return new HttpResponseOK();
  }

  @Post('/login')
  async create(ctx: Context): Promise<HttpResponse> {
    const { email } = ctx.request.body;

    const foundUser = await user.findByEmail(email);

    if (!foundUser) {
      return new HttpResponseUnauthorized();
    }

    const accessToken = await sign({ userId: (foundUser as any).id, sub: (foundUser as any).id.toString() }, { expiresIn: '10s' });
    const accessDecoded = decode(accessToken);

    console.log('accessDecoded', accessDecoded)
    const response = new HttpResponseOK({ accessToken });

    await setAuthCookie(response, accessToken);

    return response;
  }

  @Get('/test/:id')
  //@JWTRequired()
  async test(ctx: Context) {
    const user = { id: 0 };

    if (!user) {
      return new HttpResponseNotFound();
    }

    const someMusic = new Music('Wild und Frei', 0);

    const ability = defineUserAbilitiesFor(user);

    if (ability.can('read', someMusic)) {
      console.log('can');
      return new HttpResponseOK(someMusic);
    }

    console.log('cannot');
    return new HttpResponseUnauthorized();
  }

  @Get('/sign-url')
  @HttpsOnly()
  @JWTRequired()
  @ValidateQuery(signUrlQuerySchema)
  //@JWTRequired()
  async signUrl(ctx: Context) {
    const { url, expiry } = ctx.request.query;

    const signature = signUrl({
      url,
      privateKey: URL_SIGNATURE_KEY,
      expiry,
    });

    return new HttpResponseOK(signature);
  }

  @Get('/check-signed-url')
  @ValidateQuery(checkSignedUrlQuerySchema)
  async checkSignedUrl(ctx: Context) {
    const { expires, signature, url } = ctx.request.query;

    const isValid = checkSignature(signature, {
      url,
      expires: expires,
      privateKey: URL_SIGNATURE_KEY,
    });

    if (isValid) {
      return new HttpResponseNoContent();
    }

    return new HttpResponseUnauthorized();
  }
}

class Music {
  constructor(public name: string, public owner: number) {}
}
