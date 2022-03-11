import { ExistingDocument } from "@/models/couchdbModel";
import axios, { AxiosPromise } from "axios";
import PouchDB from "pouchdb";
import qs from "qs";

const databaseUrl: string = url(process.env.VUE_APP_COUCHDB_URL);

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

export function logout(): AxiosPromise {
  return axios({
    method: "delete",
    url: sessionUrl,
    withCredentials: true,
  });
}

export function getSession(): AxiosPromise {
  return axios({
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
  public db: PouchDB.Database<T>;
  private sync: PouchDB.Replication.Sync<T>;

  constructor(name: string) {
    const localDB = new PouchDB<T>(name);
    const remoteDB = new PouchDB<T>(getUrl(name));
    this.sync = localDB.sync(remoteDB, {
      live: true,
      retry: true,
    });
    this.db = localDB;
  }

  onChange(
    listener: (value: PouchDB.Core.ChangesResponseChange<T>) => unknown
  ): PouchDB.Core.Changes<T> {
    return this.db
      .changes({
        since: "now",
        live: true,
      })
      .on("change", listener);
  }

  async getAllDocuments(): Promise<ExistingDocument<T>[]> {
    const result = await this.db.allDocs({
      include_docs: true,
    });
    return result.rows.map((row) => row.doc as ExistingDocument<T>);
  }

  cancel(): void {
    this.sync.cancel();
  }
}
