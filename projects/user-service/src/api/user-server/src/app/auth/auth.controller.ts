import { Context, Post, Get, HttpResponseOK, HttpResponseUnauthorized, HttpResponseNotFound, HttpResponse } from '@foal/core';
import { getSecretOrPrivateKey, JWTRequired, setAuthCookie } from '@foal/jwt';
import { sign, decode } from 'jsonwebtoken';

import { AbilityBuilder, Ability } from '@casl/ability';

const users: any[] = [];

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
    ctx.request.body.id = users.length;
    users.push(ctx.request.body);
    return new HttpResponseOK();
  }

  @Post('/login')
  async create(ctx: Context): Promise<HttpResponse> {
    const user = users.find((user: any) => user.email === ctx.request.body.email);

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    const token = sign({ id: user.id }, getSecretOrPrivateKey(), { expiresIn: '10s' });
    const decoded = decode(token);
    console.log('decoded', decoded)
    const response = new HttpResponseOK({ token });

    await setAuthCookie(response, token);

    return response;
  }

  @Get('/test/:id')
  @JWTRequired()
  async test(ctx: Context) {
    const user = users[ctx.request.params.id];

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
}

class Music {
  constructor(public name: string, public owner: number) {}
}
