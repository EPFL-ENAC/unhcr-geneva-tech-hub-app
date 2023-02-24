import { ExistingDocument } from "@/models/couchdbModel";
// import store from "@/store";
import { SessionStorageKey } from "@/utils/storage";
import axios, { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { JwtPayload } from "jsonwebtoken";
import PouchDB from "pouchdb";
import qs from "qs";

const databaseUrl: string = url(process.env.VUE_APP_COUCHDB_URL);
const designDocumentPrefix = "_design/";

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
export enum DatabaseName {
  EnergyCookingFuels = "energy_cooking_fuels",
  EnergyCookingStoves = "energy_cooking_stoves",
  EnergySites = "energy_sites",
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

export async function loginJWT(token: string): Promise<AxiosResponse> {
  sessionStorage.setItem(SessionStorageKey.Token, token);
  // parse the jwt, and update userCTX with custom email claim
  const payload = parseJwt(token);
  if (!payload.exp) {
    sessionStorage.removeItem(SessionStorageKey.Token);
    throw new Error("no exp field in JWT token payload");
  }
  const expiredDate = new Date(payload.exp * 1000).getTime();
  const expiredInHowManySecond = parseInt(
    ((expiredDate - new Date().getTime()) / 1000).toFixed(0),
    10
  );
  const hasExpired = expiredInHowManySecond <= 0;
  if (hasExpired) {
    sessionStorage.removeItem(SessionStorageKey.Token);
    throw new Error(
      "UNHCR Azure authentication has expired: JWT token payload exp field has expired"
    );
  }

  let response: AxiosResponse;
  try {
    response = await getSessionWithBearer(token);
  } catch (error: AxiosError | unknown) {
    if (axios.isAxiosError(error)) {
      switch (error?.response?.status) {
        case 401:
          console.log(error);
          break;
        default:
          console.log("default", error);
      }
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
  public localDB: PouchDB.Database<T>;
  public remoteDB: PouchDB.Database<T>;
  private sync: PouchDB.Replication.Sync<T>;
  private onChangeListener: PouchDB.Core.Changes<T> | undefined;

  constructor(name: string) {
    const token = sessionStorage.getItem(SessionStorageKey.Token);
    const localDB = new PouchDB<T>(name);
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
    this.sync = localDB.sync(
      remoteDB,
      {
        live: true,
        retry: true,
      },
      (error, result) => {
        if (error) {
          console.error(error);
        } else {
          console.debug("sync", result);
        }
      }
    );
    this.localDB = localDB;
    this.remoteDB = remoteDB;
  }

  /**
   * @deprecated use localDB
   */
  get db(): PouchDB.Database<T> {
    return this.localDB;
  }

  onChange(
    listener: (value: PouchDB.Core.ChangesResponseChange<T>) => unknown
  ): PouchDB.Core.Changes<T> {
    this.onChangeListener = this.localDB.changes({
      since: "now",
      live: true,
    });
    this.onChangeListener.on("change", listener);
    return this.onChangeListener;
  }

  async getAllDocuments(): Promise<ExistingDocument<T>[]> {
    const result = await this.localDB.allDocs({
      include_docs: true,
    });
    return result.rows.map((row) => row.doc as ExistingDocument<T>);
  }

  async getDocuments(): Promise<ExistingDocument<T>[]> {
    return (await this.getAllDocuments()).filter(
      (doc) => !doc._id.startsWith(designDocumentPrefix)
    );
  }

  cancel(): void {
    this.sync.cancel();
    this.onChangeListener?.cancel();
  }
}
