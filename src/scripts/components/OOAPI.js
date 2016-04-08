import sha256 from 'tiny-sha256';

let response;

/*
self.myJSONPCallback = (res) => {
  response = res;
};
*/

export default class OOAPI {
  constructor(apiKey, secret) {
    this.apiKey = apiKey;
    this.secret = secret;
  }

  static getSignature(apiKey, expires, method, path, params={}, body='') {
    params.api_key = apiKey;
    params.expires = expires;
    let hashStr = sha256(this.secret + method.toUpperCase() + path + OOAPI.serialize(params, '') + body);
    console.log('\tSHA-256 hash: ', hashStr);
    let signature = new Buffer(hashStr, 'hex').toString('base64');
    // Remove any trailing = sign
    return signature.replace(/=+$/, '');
  }

  static serialize(params, delimiter) {
    return Object.keys(params).sort((a, b) => {
        if (a[0] < b[0]) {
          return -1;
        } else if (a[0] === b[0]) {
          return 0;
        } else {
          return 1;
        }
      }).map((key) => {
        return key + '=' + params[key];
      }).join(delimiter);
  }

  makeRequest(method, path, params={}, body) {
    //params.callback = 'myJSONPCallback';

    let expires = Date.now() + 86400000;
    let signature = OOAPI.getSignature(this.apiKey, expires, method, path, params, body);

    let url = [
      //'http://cdn-api.ooyala.com' + path,
      'https://api.ooyala.com' + path,
      [
        OOAPI.serialize(params, '&'),
        ['signature', encodeURIComponent(signature)].join('=')
      ].join('&').replace(/^&+/, '')
    ].join('?');

    console.log('makeRequest: ' + url);

    if (method === 'get') {
      return fetch(url)
      .then(() => {
        return response;
      });
    } else {
      return fetch(url, {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
    }
  }
};
