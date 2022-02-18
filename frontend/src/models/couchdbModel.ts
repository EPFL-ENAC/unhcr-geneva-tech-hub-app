import PouchDB from "pouchdb";

export interface CouchDBDocument extends PouchDB.Core.AllDocsMeta {
  _id: string;
  _rev?: string;
}
