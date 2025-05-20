import { IApiService, CoreApiService } from './apiservice.js';

export class AuthProxy extends IApiService {
  constructor(realService = new CoreApiService(), { apiKey, getToken }) {
    super();
    this.realService = realService;
    this.apiKey = apiKey;
    this.getToken = getToken;
  }

  async get(url) {
    const headers = { 'API-KEY': this.apiKey };
    if (this.getToken) {
      const token = await this.getToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.realService.get(url, { headers });
  }

  async post(url, body) {
    const headers = {
      'Content-Type': 'application/json',
      'API-KEY': this.apiKey,
    };
    if (this.getToken) {
      const token = await this.getToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
    return this.realService.post(url, {
      headers,
      body: JSON.stringify(body),
    });
  }
}
