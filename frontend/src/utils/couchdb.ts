import { ExistingDocument } from "@/models/couchdbModel";
import { SessionStorageKey } from "@/utils/storage";
import axios, { AxiosPromise, AxiosResponse } from "axios";
import PouchDB from "pouchdb";
import qs from "qs";

const databaseUrl: string = url(process.env.VUE_APP_COUCHDB_URL);
const designDocumentPrefix = "_design/";

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

export function login(username: string, password: string): AxiosPromise {
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

export function loginToken(token: string): AxiosPromise {
  return axios({
    method: "get",
    url: sessionUrl,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    // TODO: find a way to use the .exp field of the jwt as a + security++
    sessionStorage.setItem(SessionStorageKey.Token, token);
    return response;
  });
}

export async function logout(): Promise<AxiosResponse> {
  return await axios({
    method: "delete",
    url: sessionUrl,
    withCredentials: true,
  });
}

export async function getSession(): Promise<AxiosResponse> {
  return await axios({
    method: "get",
    url: sessionUrl,
    headers: {
      Accept: "application/json",
    },
    withCredentials: true,
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
