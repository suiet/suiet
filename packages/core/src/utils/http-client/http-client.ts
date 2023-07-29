import path from 'path-browserify';

export class HttpClient {
  private baseUrl: string;
  constructor(baseUrl: string) {
    if (typeof fetch === 'undefined') {
      throw new Error('Fetch is not available, please use a polyfill.');
    }
    this.baseUrl = baseUrl;
  }

  async post<REQ = any, RES = any>(url: string, body: REQ) {
    let fullUrl: string;
    if (url.startsWith('http') || url.startsWith('//')) {
      fullUrl = url;
    } else {
      fullUrl = path.join(this.baseUrl, url);
    }
    const response = await fetch(fullUrl, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(response.statusText);
    return response.json() as RES;
  }
}
