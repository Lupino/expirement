import mfetch from 'isomorphic-fetch';
import qs from 'query-string';
import FormData from 'form-data';
import keys from 'lodash.keys';

export function fetch(url, options = {}) {
  if (options.body) {
    options.headers = options.headers || {};
    if (Array.isArray(options.body)) {
      options.headers['content-type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    } else if (typeof options.body === 'object') {
      if (!(options.body instanceof FormData)) {
        options.headers['content-type'] =
          'application/x-www-form-urlencoded;charset=UTF-8';
        options.body = qs.stringify(options.body);
      }
    }
  }
  return mfetch(url, options);
}

export async function fetchJSON(url, options) {
  options = options || {};
  options['Accept'] = 'application/json';
  const rsp = await fetch(url, options);
  if (/application\/json/.test(rsp.headers.get('content-type'))) {
    const data = await rsp.json();
    if (data.err) {
      throw new Error(data.err);
    }
    const spec = keys(data);
    if (spec.length === 1) {
      return data[spec[0]];
    }
    return data;
  }

  const err = await rsp.text();
  throw new Error(err);
}

const HOST = 'http://127.0.0.1:3000';

export function getUrl(pathname, query=null) {
  if (query) {
    return `${HOST}${pathname}?${qs.stringify(query)}`;
  } else {
    return `${HOST}${pathname}`;
  }
}
