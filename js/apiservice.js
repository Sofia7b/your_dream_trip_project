export class IApiService {
  async get(url) {
    throw new Error('Must implement get()');
  }
  async post(url, body) {
    throw new Error('Must implement post()');
  }
}

export class CoreApiService extends IApiService {
  async get(url) {
    return fetch(url);
  }
  async post(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
}
