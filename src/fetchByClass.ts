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

type SafeTokenOn =
  | LocalStorageOptionsConfig
  | SessionStorageOptionsConfig
  | CookieStorageOptionsConfig;

type LocalStorageOptionsConfig = {
  storage?: "localStorage";
  keyname: string;
};
type SessionStorageOptionsConfig = {
  storage?: "sessionStorage";
  keyname: string;
};
type CookieStorageOptionsConfig = {
  storage?: "cookieStorage";
  keyname: string;
  opt?: CookieSetOptions;
};

const CONFIG_KEY = "config";

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
      CookieStorage.setItem(CONFIG_KEY, JSON.stringify(this.safeTokenOn));
    }

    if (!this.safeTokenOn && CookieStorage.getCookie(CONFIG_KEY)) {
      const safeTokenOnOptions = JSON.parse(
        CookieStorage.getCookie(CONFIG_KEY)!,
      );

      this.safeTokenOn = safeTokenOnOptions;
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

  private getTokenFromStorage() {
    let token: string | null = null;
    if (this.safeTokenOn) {
      if (this.safeTokenOn.storage) {
        switch (this.safeTokenOn.storage) {
          case "localStorage":
            token = LocalStorage.getItem(this.safeTokenOn.keyname);
            break;

          case "sessionStorage":
            token = SessionStorage.getItem(this.safeTokenOn.keyname);
            break;
          case "cookieStorage":
            token = CookieStorage.getItem(this.safeTokenOn.keyname);
            break;
        }
      }
    }
    return token;
  }
  private setTokenFromStorage() {
    if (this.safeTokenOn) {
      if (!CookieStorage.getCookie(CONFIG_KEY)) {
        CookieStorage.setItem(CONFIG_KEY, JSON.stringify(this.safeTokenOn));
      }

      if (this.safeTokenOn.storage) {
        switch (this.safeTokenOn.storage) {
          case "localStorage":
            LocalStorage.setItem(this.safeTokenOn.keyname, this.token!);
            break;

          case "sessionStorage":
            SessionStorage.setItem(this.safeTokenOn.keyname, this.token!);
            break;
          case "cookieStorage":
            CookieStorage.setItem(this.safeTokenOn.keyname, this.token!);
            break;
        }
      }
    }
  }
  private removeTokenFromStorage() {
    if (this.safeTokenOn) {
      if (this.safeTokenOn.storage) {
        switch (this.safeTokenOn.storage) {
          case "localStorage":
            LocalStorage.removeItem(this.safeTokenOn.keyname);
            break;

          case "sessionStorage":
            SessionStorage.removeItem(this.safeTokenOn.keyname);
            break;
          case "cookieStorage":
            CookieStorage.removeItem(this.safeTokenOn.keyname);
            break;
        }

        // if (CookieStorage.getCookie(CONFIG_KEY)) {
        //   CookieStorage.removeItem(CONFIG_KEY);
        // }
      }
    }
  }

  private verifyTokenWereSet() {
    // AGREGAR TRY CATCH EN ESTE PUNTO , AGREGAR AQUI LA VERFICACION SI EL TOKEN ESTA AGREGADO EN LOCAL STORAGE/ SESSION STORAGE
    if (this.safeTokenOn) {
      this.token = this.getTokenFromStorage();
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
        this.setTokenFromStorage();
      }

      if (safeTokenOn) {
        this.safeTokenOn = safeTokenOn;
        this.setTokenFromStorage();
      }
    }
  }

  removeToken() {
    this.token = "";
    this.headers.delete("Authorization");
    if (this.safeTokenOn) {
      this.removeTokenFromStorage();
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

interface CookieSetOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  httpOnly?: boolean;
}

class CookieStorage {
  static setItem(key: string, value: string, opt?: CookieSetOptions) {
    let finalCookie: string = "";

    if (opt) {
      const {
        httpOnly = false,
        path = "/",
        maxAge = 3600,
        secure = false,
        sameSite = "Strict",
      } = opt;
      finalCookie = `${key}=${value}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite};`;

      if (httpOnly) {
        finalCookie.concat(" HttpOnly;");
      }

      if (secure) {
        finalCookie.concat(" Secure;");
      }
    } else {
      const path = "/",
        maxAge = 3600,
        sameSite = "Strict";
      const cookieWithoutConfig = `${key}=${value}; Path=${path}; Max-Age=${maxAge}; SameSite=${sameSite};`;

      finalCookie = cookieWithoutConfig;
    }

    document.cookie = finalCookie;

    // window.cookieStore.set(key, finalCookie);
  }
  static getItem(nombre: string) {
    // 1. Añadir un signo de igual al nombre para buscar "nombre="
    let nombreBuscado = nombre + "=";

    // 2. Decodificar la cadena de cookies por si tiene caracteres especiales
    let cookiesDecodificadas = decodeURIComponent(document.cookie);

    // 3. Dividir la cadena en un array de cookies individuales
    let listaCookies = cookiesDecodificadas.split(";");

    // 4. Recorrer el array buscando la cookie correcta
    for (let i = 0; i < listaCookies.length; i++) {
      let cookie = listaCookies[i].trim(); // Quitar espacios en blanco

      // Si la cookie empieza con el nombre que buscamos, devolvemos su valor
      if (cookie.indexOf(nombreBuscado) === 0) {
        return cookie.substring(nombreBuscado.length, cookie.length);
      }
    }
    // Si no se encuentra, devuelve null o una cadena vacía
    return null;
  }

  static getCookie(name: string) {
    const cookies = document.cookie.split("; ");

    const cookie = cookies.find((cookie) => cookie.startsWith(`${name}=`));

    return cookie ? cookie.split("=")[1] : null;
  }

  static removeItem(nombre: string) {
    document.cookie = nombre + "=; max-age=0; path=/";
  }
}
