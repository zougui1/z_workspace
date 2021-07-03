import { get } from './envVar';

export const PROJECT_NAME = get('PROJECT_NAME').required().asString();
export const NODE_ENV = get('NODE_ENV').default('development').asString();
