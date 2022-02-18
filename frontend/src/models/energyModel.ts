import { CouchDBDocument } from "./couchdbModel";

export interface EnergyProjectDocument extends CouchDBDocument {
  name: string;
  users: string[];
}
