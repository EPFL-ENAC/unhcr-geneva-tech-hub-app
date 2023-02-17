import {
  getSessionWithCookie,
  loginDefault,
  loginJWT,
  logoutCookie,
} from "@/utils/couchdb";
import { SessionStorageKey } from "@/utils/storage";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

/** Config store */

enum Roles {
  "user",
  "admin",
  "specialist",
  // "author" // does not exist, it's in the document if user is in the users field
}

export const GUEST_NAME = "guest";
export interface CouchUser {
  name?: string;
  sub?: string;
  roles?: Roles[];
  loaded?: boolean;
}
export interface UserState {
  user: CouchUser;
  userLoading: boolean;
}

export interface UserCouchCredentials {
  username: string;
  password: string;
}

function generateEmptyUser(): CouchUser {
  return { loaded: false };
}
/** Default Configure state value */
function generateState(): UserState {
  return {
    user: generateEmptyUser(),
    userLoading: false,
  };
}

/** Getters */
const getters: GetterTree<UserState, RootState> = {
  user: (s): CouchUser => s.user,
  token: () => sessionStorage.getItem(SessionStorageKey.Token),
};

/** Mutations */
const mutations: MutationTree<UserState> = {
  SET_USER(
    state,
    value: {
      name?: string;
      roles?: string[];
      sub?: string;
    }
  ) {
    state.user = {
      name: value.name ?? "",
      sub: value.sub,
      roles: value.roles ? (value.roles as unknown as Roles[]) : [],
      loaded: false,
    };
  },
  SET_USER_LOADING(state) {
    state.userLoading = true;
    state.user.loaded = false;
  },
  UNSET_USER_LOADING(state) {
    state.userLoading = false;
    state.user.loaded = true;
  },
};

/** Action */
const actions: ActionTree<UserState, RootState> = {
  login: (
    context: ActionContext<UserState, RootState>,
    credentials: UserCouchCredentials
  ) => {
    context.commit("SET_USER_LOADING");
    // removeItem: idea was to remove azure authentication info
    // it is biased: we trigger a warning and logout for azure first
    sessionStorage.removeItem(SessionStorageKey.Token);
    const { username, password } = credentials;
    return loginDefault(username, password)
      .then((axiosResponse) => {
        context.commit("SET_USER", axiosResponse.data);
        return axiosResponse;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  loginToken: async (
    context: ActionContext<UserState, RootState>,
    token: string
  ) => {
    context.commit("SET_USER_LOADING");
    return loginJWT(token)
      .then((response) => {
        context.commit("SET_USER", response.data);
        return response;
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  loginAsGuest: async (context: ActionContext<UserState, RootState>) => {
    // force logout, just in case user already logged via the /db interface
    context.commit("SET_USER_LOADING");
    sessionStorage.removeItem(SessionStorageKey.Token);
    await logoutCookie();
    context.commit("SET_USER", {
      name: GUEST_NAME,
      roles: [GUEST_NAME],
    });
    context.commit("UNSET_USER_LOADING");
  },
  logout: async (context: ActionContext<UserState, RootState>) => {
    context.commit("SET_USER_LOADING");
    sessionStorage.removeItem(SessionStorageKey.Token);
    if (context.getters.user.sub) {
      // force local state to empty then redirect to unhcr
      // if unhcr logout does not work at least, our ux will show as unlogged
      context.commit("SET_USER", generateEmptyUser());
      context.commit("UNSET_USER_LOADING");
      window.location.href =
        "https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=https%3A%2F%2Funhcr-tss.epfl.ch";
    } else {
      await logoutCookie();
      context.commit("SET_USER", generateEmptyUser());
      context.commit("UNSET_USER_LOADING");
    }
  },
  getSession: (context: ActionContext<UserState, RootState>) => {
    // if user logged in as guest no session needed!
    const currentUser: CouchUser = context.getters["user"];
    const token = sessionStorage.getItem(SessionStorageKey.Token);
    if (token) {
      // we're a oauth user
      return context.dispatch("loginToken", token);
    } else if (currentUser.name !== GUEST_NAME) {
      // we're not a guest user nor a oauth user but a normal user (couchdb user)
      context.commit("SET_USER_LOADING");
      return getSessionWithCookie()
        .then((response) => {
          const user = response.data;
          context.commit("SET_USER", user.userCtx);
        })
        .finally(() => {
          context.commit("UNSET_USER_LOADING");
        });
    }
  },
};

/** VuexStore */
const UserModule: Module<UserState, RootState> = {
  namespaced: true,
  state: generateState(),
  getters,
  mutations,
  actions,
};

export default UserModule;
