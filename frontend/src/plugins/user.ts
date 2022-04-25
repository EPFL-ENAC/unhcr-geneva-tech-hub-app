import { CouchUser } from "@/store/UserModule";
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
      // v-if="$can('edit', project)"
      // this function may return false or true
      const user = store.getters["UserModule/user"];
      if (user.loaded) {
        //   const isUserAdmin = user.roles.indexOf(USER_ADMIN) >= 0;
        const isDBAdmin = user.roles.indexOf(DB_ADMIN) >= 0;
        //   const isSpecialist = user.roles.indexOf(SPECIALIST) >= 0;
        //   const isUser = user.roles.indexOf(USER) >= 0;
        if (!obj || !obj.users) {
          return false;
        }
        const isAuthor = obj.users.indexOf(user.name) >= 0 ?? false;
        //   const isLoggedIn = user.name.length > 0;

        if (actionName === "edit") {
          return isAuthor;
        }
        if (actionName === "delete") {
          return isDBAdmin;
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
