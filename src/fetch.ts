type RequestMethods = "POST" | "DELETE" | "GET" | "PATCH" | "PUT";

interface RequestOptions {
  method?: RequestMethods;
  body?: any;
  token?: string;
  contentType?: "application/json" | "FormData";
  searchParams?: Record<string, any>;
}

export async function makeApiRequest<T>(
  url: string,
  options?: RequestOptions,
): Promise<T> {
  const headers = new Headers();
  let optionRequest: RequestInit = {
    headers,
  };
  let partialUrl: string = "";

  if (options) {
    const {
      body,
      token = "",
      method = "GET",
      contentType = "application/json",
      searchParams,
    } = options;
    optionRequest.method = method;

    if (
      method != "GET" &&
      method != "DELETE" &&
      body &&
      contentType == "application/json"
    ) {
      headers.append("Content-Type", "application/json");
      optionRequest.body = JSON.stringify(body);
    } else {
      optionRequest.body = body;
    }

    if (token) {
      headers.append("Authorization", `Bearer token`);
    }

    if (searchParams) {
      const urlWithSearchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(searchParams)) {
        urlWithSearchParams.append(key, value.toString());
      }

      partialUrl = urlWithSearchParams.toString();
    }
  }

  const finalUrl = partialUrl != "" ? url.concat("?", partialUrl) : url;

  const request = await fetch(finalUrl, optionRequest);
  const data = await request.json();

  return data as T;
}
