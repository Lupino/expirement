export function promiseToCallback(promiseFunction) {
  return (...argv) => {
    const callback = argv.pop();
    promiseFunction(...argv)
      .then((...ret) => callback(null, ...ret))
      .catch((err) => callback(err));
  };
}

export function callbackToPromise(callbackFunction) {
  return (...argv) => {
    return new Promise((resolve, reject) => {
      callbackFunction(...argv, (err, ...ret) => {
        if (err) return reject(err);
        resolve(...ret);
      });
    });
  };
}

import { SearchService } from 'yuntan-service';

export const searchSrv = new SearchService({
  host: 'https://gw.huabot.com',
  secret: 'abfbc25c8ea2969a4f4dac8f0b161d274847554508b87ed182551627e9749fc0',
  key: 'a54ec9e66bca54fc31a1',
  secure: true
});
