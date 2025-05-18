export class AuthProxy {
  constructor({ apiKey, getToken }) {
    this.apiKey = apiKey;
    this.getToken = getToken;
  }

  async request(url, options = {}) {
    const headers = options.headers || {};

    headers['API-KEY'] = this.apiKey;

    if (this.getToken) {
      const token = await this.getToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    const finalOptions = {
      ...options,
      headers,
    };

    const response = await fetch(url, finalOptions);
    if (response.status === 401 && this.getToken) {
      const newToken = await this.getToken(true);
      headers['Authorization'] = `Bearer ${newToken}`;
      return fetch(url, { ...finalOptions, headers });
    }
    return response;
  }

  get(url) {
    return this.request(url, { method: 'GET' });
  }

  post(url, body) {
    return this.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
}
