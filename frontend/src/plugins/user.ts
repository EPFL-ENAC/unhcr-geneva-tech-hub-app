import { CouchUser } from "@/store/UserModule";
import { VueConstructor } from "vue";
import { Store } from "vuex";

declare module "vue/types/vue" {
  // 3. Declare augmentation for Vue
  interface Vue {
    $can: (actionName: string, obj: Store<CouchUser>) => boolean;
    $user: (isStatus: string) => boolean;
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

      return false;
    };

    Vue.prototype.$user = (isStatus: string): boolean => {
      // use like so:
      // v-if="$user('isLoggedIn')"
      const user = store.getters["UserModule/user"];
      const rights = {
        isUserAdmin: user.roles.indexOf(USER_ADMIN) >= 0,
        isDBAdmin: user.roles.indexOf(DB_ADMIN) >= 0,
        isSpecialist: user.roles.indexOf(SPECIALIST) >= 0,
        isUser: user.roles.indexOf(USER) >= 0,
        isLoggedIn: user.name.length > 0,
        isLoggedOut: user.name.length == 0,
      } as Record<string, boolean>;
      return rights[isStatus];
    };
  }
})();
