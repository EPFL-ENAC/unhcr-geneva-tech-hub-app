import axios, { AxiosPromise } from "axios";
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

export function createSyncDatabase<T = Record<string, unknown>>(
  name: string
): PouchDB.Database<T> {
  const localDB = new PouchDB<T>(name);
  const remoteDB = new PouchDB<T>(getUrl(name));
  localDB.sync(remoteDB, { live: true, retry: true });
  return localDB;
}
