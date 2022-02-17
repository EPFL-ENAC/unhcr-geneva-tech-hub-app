import axios, { AxiosPromise } from "axios";

import { CouchDBDocument } from "@/models/couchdbModel";
import PouchDB from "pouchdb";
import qs from "qs";

const databaseUrl: string =
  process.env.VUE_APP_COUCHDB_URL ?? "http://localhost:5984";

function getUrl(path: string): string {
  const url = new URL(databaseUrl);
  url.pathname = path;
  return url.toString();
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

export function createSyncDatabase<T extends CouchDBDocument>(
  name: string
): SyncDatabase<T> {
  const localDB = new PouchDB<T>(name);
  const remoteDB = new PouchDB<T>(getUrl(name));
  const sync: PouchDB.Replication.Sync<T> = localDB.sync(remoteDB, {
    live: true,
    retry: true,
  });
  return new SyncDatabase(localDB, sync);
}

export class SyncDatabase<T extends CouchDBDocument> {
  constructor(
    public db: PouchDB.Database<T>,
    private sync: PouchDB.Replication.Sync<T>
  ) {}

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

  async getAllDocuments(): Promise<T[]> {
    const result = await this.db.allDocs({
      include_docs: true,
    });
    return result.rows.map((row) => row.doc as T);
  }

  cancel(): void {
    this.sync.cancel();
  }
}
