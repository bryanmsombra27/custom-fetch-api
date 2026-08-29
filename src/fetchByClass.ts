interface CustomFetchSearchParams {
  searchParams?: Record<string, any>;
}
type ContentType = "application/json" | "FormData";

export interface CustomFetchOptions extends CustomFetchSearchParams {
  body?: any;
  contentType?: ContentType;
}
export interface BaseOptions {
  baseUrl?: string;
  safeTokenOn?: SafeTokenOn;
}

type SafeTokenOn = LocalStorageOptionsConfig | SessionStorageOptionsConfig;

type LocalStorageOptionsConfig = {
  storage?: "localStorage";
  keyname: string;
};
type SessionStorageOptionsConfig = {
  storage?: "sessionStorage";
  keyname: string;
};

export class CustomFetchAPI {
  private baseUrl?: string;
  private token?: string | null;
  private headers: Headers;
  private optionRequest: RequestInit;
  private safeTokenOn?: SafeTokenOn;
  constructor(options?: BaseOptions) {
    const headers = new Headers();
    if (options?.baseUrl) this.baseUrl = options.baseUrl;
    this.headers = headers;
    this.optionRequest = {
      headers: this.headers,
    };

    if (options?.safeTokenOn) {
      this.safeTokenOn = options.safeTokenOn;
    }
  }

  async get<T>(
    url: string,
    searchParams?: CustomFetchSearchParams,
  ): Promise<T> {
    this.verifyTokenWereSet();
    this.optionRequest.method = "GET";

    if (this.optionRequest.body) {
      this.optionRequest.body = undefined;
    }
    if (this.headers.has("Content-Type")) {
      this.headers.delete("Content-Type");
    }

    const finalUrl = this.setParams(url, { searchParams });
    const request = await fetch(finalUrl, this.optionRequest);
    const data = await request.json();

    return data as T;
  }
  async post<T>(
    url: string,
    {
      searchParams,
      body,
      contentType = "application/json",
    }: CustomFetchOptions,
  ): Promise<T> {
    this.verifyTokenWereSet();

    this.optionRequest.method = "POST";
    this.setBody(body, contentType);
    const finalUrl = this.setParams(url, { searchParams });
    const request = await fetch(finalUrl, this.optionRequest);
    const data = await request.json();

    return data as T;
  }
  async put<T>(
    url: string,
    { searchParams, body, contentType }: CustomFetchOptions,
  ): Promise<T> {
    this.verifyTokenWereSet();

    this.optionRequest.method = "PUT";
    this.setBody(body, contentType);
    const finalUrl = this.setParams(url, { searchParams });
    const request = await fetch(finalUrl, this.optionRequest);
    const data = await request.json();

    return data as T;
  }
  async patch<T>(
    url: string,
    { searchParams, body, contentType }: CustomFetchOptions,
  ): Promise<T> {
    this.verifyTokenWereSet();

    this.optionRequest.method = "PATCH";
    this.setBody(body, contentType);
    const finalUrl = this.setParams(url, { searchParams });

    const request = await fetch(finalUrl, this.optionRequest);
    const data = await request.json();

    return data as T;
  }
  async delete<T>(url: string): Promise<T> {
    this.verifyTokenWereSet();

    this.optionRequest.method = "DELETE";
    if (this.optionRequest.body) {
      this.optionRequest.body = undefined;
    }
    if (this.headers.has("Content-Type")) {
      this.headers.delete("Content-Type");
    }

    const uri = this.baseUrl ? `${this.baseUrl}${url}` : url;
    const request = await fetch(uri, this.optionRequest);
    const data = await request.json();

    return data as T;
  }

  private setBody(body?: any, contentType?: ContentType) {
    if (contentType == "application/json") {
      this.headers.append("Content-Type", "application/json");
    }
    if (body && contentType == "application/json") {
      this.optionRequest.body = JSON.stringify(body);
    }
  }

  private setParams(url: string, { searchParams }: CustomFetchSearchParams) {
    let partialUrl: string = "";

    if (searchParams) {
      const urlWithSearchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(searchParams)) {
        urlWithSearchParams.append(key, value.toString());
      }

      partialUrl = urlWithSearchParams.toString();
    }
    const uri = this.baseUrl ? `${this.baseUrl}${url}` : url;
    const finalUrl = partialUrl != "" ? uri.concat("?", partialUrl) : uri;
    return finalUrl;
  }

  private verifyTokenWereSet() {
    if (this.safeTokenOn) {
      this.token =
        this.safeTokenOn.storage == "localStorage"
          ? LocalStorage.getItem(this.safeTokenOn.keyname)
          : SessionStorage.getItem(this.safeTokenOn.keyname);
    }

    if (this.token != null && !this.headers.has("Authorization")) {
      this.headers.append("Authorization", `Bearer ${this.token}`);
    }
  }

  setToken(token: string, safeTokenOn?: SafeTokenOn) {
    if (token) {
      this.token = token;
      this.headers.append("Authorization", `Bearer ${token}`);
      if (this.safeTokenOn) {
        this.safeTokenOn.storage == "localStorage"
          ? LocalStorage.setItem(this.safeTokenOn.keyname, token)
          : SessionStorage.setItem(this.safeTokenOn.keyname, token);
      }

      if (safeTokenOn) {
        this.safeTokenOn = safeTokenOn;
        this.safeTokenOn.storage == "localStorage"
          ? LocalStorage.setItem(this.safeTokenOn.keyname, token)
          : SessionStorage.setItem(this.safeTokenOn.keyname, token);
      }
    }
  }

  removeToken() {
    this.token = "";
    this.headers.delete("Authorization");
    if (this.safeTokenOn) {
      this.safeTokenOn.storage == "localStorage"
        ? LocalStorage.removeItem(this.safeTokenOn.keyname)
        : SessionStorage.removeItem(this.safeTokenOn.keyname);
    }
  }
}

class LocalStorage {
  static getItem(key: string) {
    return localStorage.getItem(key);
  }

  static setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
class SessionStorage {
  static getItem(key: string) {
    return sessionStorage.getItem(key);
  }

  static setItem(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }
  static removeItem(key: string) {
    sessionStorage.removeItem(key);
  }
}
