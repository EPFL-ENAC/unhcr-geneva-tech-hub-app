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

export function checkIfAdmin(user: CouchUser) {
  // either we have the role 'admin' or '_admin'
  // or we are in a custom list of unhcr users sub
  const unhcrAdmins = [
    "TBxz7Wb3aSrQGeFx1EbBtrtaKPht-4M87pznkWC2BYE", // nimri
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
        const isUser = !user.roles?.includes(GUEST_NAME) ?? false;
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
            // if reference, even admin cannot edit; first we need to remove 'as reference' in the list
            return false;
          }
          return isAuthor || isAdmin;
        }

        if (actionName === "view") {
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
        Guest: user.loaded && user.name === GUEST_NAME,
        Admin: user.loaded && checkIfAdmin(user),
        Azure: user.loaded && user.sub !== undefined && user.sub !== null,
        LoggedIn: user.loaded && LoggedInName,
        LoggedOut: (user.loaded && LoggedOutName) || user.loaded == false,
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
