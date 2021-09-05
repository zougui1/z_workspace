export interface ICorsOptions {
  AccessControlAllowOrigin?: string;
  AccessControlAllowMethods?: string;
  AccessControlAllowHeaders?: string;
}

export type CorsOptions = ICorsOptions | string;
