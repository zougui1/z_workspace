const reLastSlash = /\/$/;
const reFirstSlash = /^\//;

export const joinUrlPaths = (...paths: string[]): string => {
  return paths
    .map(path => path.replace(reLastSlash, '').replace(reFirstSlash, ''))
    .join('/');
}
