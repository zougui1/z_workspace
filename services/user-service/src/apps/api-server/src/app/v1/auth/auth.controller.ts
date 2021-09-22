import { Context, Post, Get, HttpResponseOK, HttpResponseUnauthorized, HttpResponse, HttpResponseNoContent } from '@foal/core';
import { JWTRequired, setAuthCookie } from '@foal/jwt';

import { user } from '@user-service/database';

import { HttpsOnly, signUrl, checkSignature, DefineUserAbilities, AbilityState } from '@zougui/server-security';
import { ValidateQuery, ValidateBody } from '@zougui/server-validation';
import { sign, decode } from '@zougui/jwt';

import {
  signupBodySchema,
  loginBodySchema,
  authorizeBodySchema,
  signUrlQuerySchema,
  checkSignedUrlQuerySchema,
} from './auth.schemas';
import { URL_SIGNATURE_KEY } from '../../../env';

enum StrictChecker {
  can = 'must',
  cannot = 'mustNot',
}

interface Rule {
  type: 'can' | 'cannot';
  action: string;
  subject: string | { __typename: string; [key: string]: any; };
  field?: string;
}

export class AuthController {

  @Post('/signup')
  @ValidateBody(signupBodySchema, { allowUnknown: false })
  async isngup(ctx: Context) {
    await user.create(ctx.request.body);
    return new HttpResponseOK();
  }

  @Post('/login')
  @ValidateBody(loginBodySchema)
  async login(ctx: Context): Promise<HttpResponse> {
    const { email } = ctx.request.body;

    const foundUser = await user.findByEmail(email);

    console.log('foundUser', foundUser);

    if (!foundUser) {
      return new HttpResponseUnauthorized();
    }

    // TODO verify password
    const accessToken = await sign({ userId: (foundUser as any).id, sub: (foundUser as any).id.toString() }, { expiresIn: '10s' });
    const accessDecoded = decode(accessToken);

    console.log('accessDecoded', accessDecoded)
    const response = new HttpResponseOK({ accessToken });

    await setAuthCookie(response, accessToken);

    return response;
  }

  @Post('/authenticate')
  @JWTRequired()
  authenticate(ctx: Context) {
    return new HttpResponseOK(ctx.user);
  }

  @Post('/authorize')
  @JWTRequired()
  @ValidateBody(authorizeBodySchema)
  @DefineUserAbilities()
  async authorize(ctx: Context<any, any, AbilityState>) {
    const { ability } = ctx.state;
    const { rules } = ctx.request.body;

    for (const rule of rules as Rule[]) {
      ability[StrictChecker[rule.type]](rule.action, rule.subject, rule.field);
    }

    return new HttpResponseOK(ctx.user);
  }

  @Get('/sign-url')
  @JWTRequired()
  @HttpsOnly()
  @ValidateQuery(signUrlQuerySchema)
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
  @HttpsOnly()
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
