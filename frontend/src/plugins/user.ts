import { CouchUser, GUEST_NAME } from "@/store/UserModule";
import { VueConstructor } from "vue";
import { Store } from "vuex";

declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    $can: (actionName: string, obj: ObjWithUsersField) => boolean;
    $user: (isStatus: string) => boolean;
    $userName: () => string;
    $userRoles: () => string[];
  }
}

interface ObjWithUsersField {
  users: string[];
}

const USER_ADMIN = "admin";
const DB_ADMIN = "_admin";
const SPECIALIST = "specialist";
const USER = "user";

export default new (class User {
  public install(Vue: VueConstructor, { store }: { store: Store<CouchUser> }) {
    Vue.prototype.$can = (
      actionName: string,
      obj: ObjWithUsersField
    ): boolean => {
      // return false or true
      const user = store.getters["UserModule/user"];
      if (user.loaded) {
        const isAdmin =
          user.roles.indexOf(USER_ADMIN) >= 0 ||
          user.roles.indexOf(DB_ADMIN) >= 0;

        if (actionName === "admin") {
          return isAdmin;
        }
        const isUser = user.roles.indexOf(GUEST_NAME) == -1;
        // only guest are not allowed to create!
        // if roles is empty it means it's a unhcr account
        if (actionName === "create") {
          return isUser;
        }
        const userIndex = obj?.users?.indexOf(user.name) ?? -1;
        const isAuthor = userIndex >= 0;
        if (actionName === "edit" && obj?.users) {
          return isAuthor || isAdmin;
        }

        if (actionName === "delete" && obj?.users) {
          return isAuthor || isAdmin;
        }
      }

      return false;
    };

    Vue.prototype.$user = (isStatus: string): boolean => {
      const user = store.getters["UserModule/user"];
      const rights = {
        isUserAdmin: user.loaded && user.roles.indexOf(USER_ADMIN) >= 0,
        isDBAdmin: user.loaded && user.roles.indexOf(DB_ADMIN) >= 0,
        isSpecialist: user.loaded && user.roles.indexOf(SPECIALIST) >= 0,
        isUser: user.loaded && user.roles.indexOf(USER) >= 0,
        isGuest: user.loaded && user.name === GUEST_NAME,
        isLoggedIn: user.loaded && user.name.length > 0,
        isLoggedOut: user.loaded && user.name.length == 0,
      } as Record<string, boolean>;
      return rights[isStatus];
    };

    Vue.prototype.$userName = (): string => {
      // use like so:
      // v-if="$user('isLoggedIn')"
      const user = store.getters["UserModule/user"];
      return user.name;
    };

    Vue.prototype.$userRoles = (): string[] => {
      // use like so:
      // v-if="$user('isLoggedIn')"
      const user = store.getters["UserModule/user"];
      return user.roles;
    };
  }
})();
