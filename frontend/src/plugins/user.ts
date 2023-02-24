import { CouchUser, GUEST_NAME, Roles } from "@/store/UserModule";
import { VueConstructor } from "vue";
import { Store } from "vuex";

declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    $can: (actionName: string, obj: ObjWithUsersField) => boolean;
    $user: () => CouchUser;
    $userIs: (isStatus: string) => boolean;
    $userName: () => string;
    $userRoles: () => string[];
  }
}

interface ObjWithUsersField {
  users: (CouchUser | string)[];
  reference?: boolean;
}
const USER_ADMIN = "admin";
const DB_ADMIN = "_admin";
const SPECIALIST = "specialist";
const USER = "user";

export function checkIfAdmin(user: CouchUser) {
  // either we have the role 'admin' or '_admin'
  // or we are in a custom list of unhcr users sub
  const unhcrAdmins = [
    "TBxz7Wb3aSrQGeFx1EbBtrtaKPht-4M87pznkWC2BYE", // nimri
    "ZClxS-3mzvYkIq5kO8ULO37PaSFV-d9Z0Oml1CVoVeQ", // testtss
  ];
  const isDBAdmin = user.roles?.includes(Roles[Roles._admin]) ?? false;
  const isAdmin = user.roles?.includes(Roles[Roles.admin]) ?? false;

  let isUNHCRAdmins = false;
  if (typeof user === "string") {
    isUNHCRAdmins = unhcrAdmins.includes(user);
  } else {
    isUNHCRAdmins =
      unhcrAdmins.includes(user?.name ?? "") ||
      unhcrAdmins.includes(user?.sub ?? "");
  }
  return isAdmin || isDBAdmin || isUNHCRAdmins;
}

export function checkIfUserExist(
  user: CouchUser | string,
  users: (CouchUser | string)[]
): boolean {
  // Try for name or sub
  // filter users with object style
  const usersObject: CouchUser[] = users.filter(
    (x) => typeof x === "object" && x !== null
  ) as CouchUser[];
  const usersString = users.filter((x) => typeof x == "string");
  const usersName: string[] = usersObject
    .map((x) => x?.name)
    .filter((x) => x !== undefined) as string[];
  const usersSub: string[] = usersObject
    .map((x) => x?.sub)
    .filter((x) => x !== undefined) as string[];
  const allPossibleUsers = usersString.concat(usersName).concat(usersSub);
  // BIG warning if name of user contains @unhcr.org the couchdb won't allow them
  if (typeof user === "string") {
    return allPossibleUsers.includes(user);
  }
  return (
    allPossibleUsers.includes(user?.name ?? "") ||
    allPossibleUsers.includes(user?.sub ?? "")
  );
}

export function checkUserExists(
  values: (CouchUser | string)[]
): (v: string | CouchUser) => boolean | string {
  return (value: string | CouchUser) => {
    return !checkIfUserExist(value, values) || "Already exists.";
  };
}

export default new (class User {
  public install(Vue: VueConstructor, { store }: { store: Store<CouchUser> }) {
    Vue.prototype.$can = (
      actionName: string,
      obj: ObjWithUsersField
    ): boolean => {
      // return false or true
      const user = store.getters["UserModule/user"];
      if (user.loaded) {
        const isAdmin = checkIfAdmin(user);
        if (actionName === "admin") {
          return isAdmin;
        }
        const isUser = user.roles.indexOf(GUEST_NAME) == -1;
        // only guest are not allowed to create!
        // if roles is empty it means it's a unhcr account
        if (actionName === "create") {
          return isUser;
        }
        if (obj?.users === undefined) {
          return false;
        }
        const isAuthor = checkIfUserExist(user, obj?.users);
        if (actionName === "edit") {
          if (obj.reference) {
            return false;
          }
          return isAuthor || isAdmin;
        }

        if (actionName === "delete") {
          return isAuthor || isAdmin;
        }
      }

      return false;
    };

    Vue.prototype.$userIs = (isStatus: string): boolean => {
      const user = store.getters["UserModule/user"];
      const LoggedOutName =
        user.name === null || user.name === undefined || user.name === "";
      const LoggedInName = user.name !== "" && typeof user.name === "string";
      const rights = {
        UserAdmin: user.loaded && user.roles.indexOf(USER_ADMIN) >= 0,
        DBAdmin: user.loaded && user.roles.indexOf(DB_ADMIN) >= 0,
        Specialist: user.loaded && user.roles.indexOf(SPECIALIST) >= 0,
        User: user.loaded && user.roles.indexOf(USER) >= 0,
        Guest: user.loaded && user.name === GUEST_NAME,
        LoggedIn: user.loaded && LoggedInName,
        LoggedOut: user.loaded && LoggedOutName,
      } as Record<string, boolean>;
      return rights[isStatus];
    };

    Vue.prototype.$userName = (): string =>
      store.getters["UserModule/user"].name;

    Vue.prototype.$user = (): string => store.getters["UserModule/user"];

    Vue.prototype.$userRoles = (): string[] =>
      store.getters["UserModule/user"].roles;
  }
})();
