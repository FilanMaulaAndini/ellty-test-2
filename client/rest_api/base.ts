import { getSession, signOut } from "next-auth/react";

interface FetchOptions {
  body?: any;
  json?: any;
  params?: Record<string, string | number>;
  headers?: Record<string, string>;
  isPrivate?: boolean;
}

export interface ApiErrorMeta {
  status?: number;
  message?: string;
}

export interface ApiError {
  meta?: ApiErrorMeta;
  status?: number;
  message?: string;
  data?: Record<string, any>;
}

class BaseApiFetch {
  #getUrl(path = "", params: Record<string, string | number> = {}) {
    const queryString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");

    return `${process.env.NEXT_PUBLIC_API_URL}${path}${
      queryString ? "?" + queryString : ""
    }`;
  }

  #getToken = async (): Promise<string | null> => {
    try {
      const session = await getSession();
      return session?.accessToken ?? null;
    } catch (error) {
      console.error("GET TOKEN ERROR:", error);
      return null;
    }
  };

  fetch = async (
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    { body, json, params, headers, isPrivate = false }: FetchOptions = {}
  ) => {
    const url = this.#getUrl(path, params);
    if (isPrivate) {
      const token = await this.#getToken();
      if (token) {
        headers = {
          ...headers,
          Authorization: `Bearer ${token}`,
        };
      }
    }

    try {
      const resp = await fetch(url, {
        method,
        headers: {
          Accept: "application/json",
          ...(json ? { "Content-Type": "application/json" } : {}),
          ...headers,
          // Authorization: `Bearer ${token}`,
        },

        body: body || (json ? JSON.stringify(json) : null),
      });

      const data = resp.status !== 204 ? await resp.json() : null;

      if (!resp.ok) {
        const message = data?.message || "Something went wrong";
        alert(`Error ${resp.status}: ${message}`); // show alert
        return Promise.reject({ status: resp.status, message });
      }

      return data;
    } catch (err: any) {
      alert(`Network Error: ${err.message || "Failed to fetch"}`); // network alert
      return Promise.reject({
        status: 500,
        message: err.message || "Network error",
      });
    }
  };
}

export default BaseApiFetch;
