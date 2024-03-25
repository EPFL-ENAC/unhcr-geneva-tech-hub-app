import { env } from "@/config";
import { SessionStorageKey } from "@/utils/storage";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { JwtPayload } from "jsonwebtoken";
import PouchDB from "pouchdb-browser";
import qs from "qs";

const databaseUrl: string = url(
  `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_COUCHDB_URL}`
);

export function parseJwt(token: string): JwtPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

function url(value = ""): string {
  try {
    return new URL(value).toString();
  } catch {
    const url = new URL(window.location.origin);

    url.pathname = value;

    return url.toString();
  }
}

function getUrl(path: string): string {
  return `${databaseUrl}/${path}`;
}

const sessionUrl: string = getUrl("_session");

export function loginDefault(username: string, password: string): AxiosPromise {
  return axios({
    method: "post",
    url: sessionUrl,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: qs.stringify({
      name: username,
      password: password,
    }),
    withCredentials: true,
  });
}

export class ExpireError extends Error {
  type: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, options: any) {
    // Need to pass `options` as the second parameter to install the "cause" property.
    super(message, options);
    this.type = options.type;
  }
}

function expireTokenAndError(message: string): void {
  sessionStorage.removeItem(SessionStorageKey.Token);
  throw new ExpireError(message, { type: "warning" });
}

export async function loginJWT(token: string): Promise<AxiosResponse> {
  sessionStorage.setItem(SessionStorageKey.Token, token);
  // parse the jwt, and update userCTX with custom email claim
  const payload = parseJwt(token);
  if (!payload.exp) {
    if (env.VUE_APP_ENVIRONEMENT !== "production") {
      console.error("(no exp field in JWT token payload)");
    }
    throw expireTokenAndError("Authentication has expired, please login again");
  }
  const expiredDate = new Date(payload.exp * 1000).getTime();
  const ttlSeconds = parseInt(
    ((expiredDate - new Date().getTime()) / 1000).toFixed(0),
    10
  );
  const hasExpired = ttlSeconds <= 0;
  if (hasExpired) {
    if (env.VUE_APP_ENVIRONEMENT !== "production") {
      console.error(
        "Authentication has expired, please login again: expiration (exp) not in future"
      );
    }
    throw expireTokenAndError("Authentication has expired, please login again");
  }

  let response: AxiosResponse;
  try {
    response = await getSessionWithBearer(token);
    // CATCH
    // should be "info":{"authentication_handlers":["jwt","cookie","default"],"authenticated":"jwt"}
    if (
      !response.data?.info?.authentication_handlers?.includes("jwt") ||
      response.data?.info?.authenticated !== "jwt"
    ) {
      throw new Error(
        `Authentication failed: JWT authentication should be enabled on Database; restart database with proper config`
      );
    }
  } catch (error: AxiosError | unknown) {
    if (axios.isAxiosError(error)) {
      // 401 Unauthorized or other
      // {"error":"unauthorized","reason":"exp not in future"}
      throw expireTokenAndError(
        `Authentication failed, please login again: ${
          error?.response?.status
        } ${JSON.stringify(error?.response?.data ?? "unknown message")}`
      );
    }
    sessionStorage.removeItem(SessionStorageKey.Token);
    throw error;
  }

  const userFromCouchDB = response.data.userCtx;
  userFromCouchDB.sub = payload.sub;
  // we don't want to have an undefined name, since it is equal to not logged in user
  userFromCouchDB.name = payload.email ?? userFromCouchDB.name;
  userFromCouchDB.loaded = true;
  response.data = userFromCouchDB;
  return response;
}

export async function logoutCookie(): Promise<AxiosResponse> {
  return await axios({
    method: "delete",
    url: sessionUrl,
    withCredentials: true,
  });
}

export async function getSessionWithCookie(): Promise<AxiosResponse> {
  return await axios({
    method: "get",
    url: sessionUrl,
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
  });
}

export async function getSessionWithBearer(
  token: string
): Promise<AxiosResponse> {
  return await axios({
    method: "get",
    url: sessionUrl,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * @deprecated call directly new SyncDatabase(name)
 */
export function createSyncDatabase<T>(name: string): SyncDatabase<T> {
  return new SyncDatabase(name);
}

export class SyncDatabase<T> {
  public remoteDB: PouchDB.Database<T>;
  private onChangeListener: PouchDB.Core.Changes<T> | undefined;

  constructor(name: string) {
    const token = sessionStorage.getItem(SessionStorageKey.Token);
    const remoteDB = new PouchDB<T>(getUrl(name), {
      fetch: token
        ? (url, opts) => {
            (opts?.headers as Headers | undefined)?.set(
              "Authorization",
              `Bearer ${token}`
            );
            return PouchDB.fetch(url, opts);
          }
        : undefined,
    });
    this.remoteDB = remoteDB;
  }

  cancel(): void {
    this.onChangeListener?.cancel();
  }
}
