import { CouchUser } from "./UserModule";

export function getNewName(name: string): string {
  const v1 = "(v1)";
  let newName = `${name} ${v1}`;
  const match = name.match(/\(v[0-9]+\)$/);
  if (match) {
    const version = match[0];
    const newVersionMatch = version.match(/[0-9]+/);
    if (newVersionMatch) {
      const newVersion = parseInt(newVersionMatch[0], 10) + 1;
      newName = name.replace(/\(v[0-9]+\)$/, `(v${newVersion})`);
    }
  }
  return newName;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ /* eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types */
export function updateMetaFields(doc: any, user: CouchUser): any {
  const currentDate = new Date().toISOString();
  doc.users = [user.name];
  doc.created_by = user.name;
  doc.created_at = currentDate;
  doc.updated_at = currentDate;
  doc.updated_by = user.name;
  return doc;
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */ /* eslint-disable-next-line  @typescript-eslint/explicit-module-boundary-types */
export function updateMetaFieldsForUpdate(doc: any, user: CouchUser): any {
  const currentDate = new Date().toISOString();
  doc.updated_at = currentDate;
  doc.updated_by = user.name;
  return doc;
}
