import {
  getSession as getSessionTool,
  login as loginTool,
  loginToken as loginTokenTool,
  logout as logoutTool,
} from "@/utils/couchdb";
import { SessionStorageKey } from "@/utils/storage";
import { JwtPayload } from "jsonwebtoken";
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

export function parseJwt(token: string): JwtPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export const GUEST_NAME = "guest";
export interface CouchUser {
  name?: string;
  sub?: string;
  roles?: Roles[];
  loaded: boolean;
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
    sessionStorage.removeItem(SessionStorageKey.Token);
    const { username, password } = credentials;
    return loginTool(username, password)
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
  loginToken: (context: ActionContext<UserState, RootState>, token: string) => {
    context.commit("SET_USER_LOADING");
    sessionStorage.removeItem(SessionStorageKey.Token);
    return loginTokenTool(token)
      .then((axiosResponse) => {
        // parse again the jwt, and update userCTX with custom email claim
        const payload = parseJwt(token);
        const userFromCouchDB = axiosResponse.data.userCtx;
        userFromCouchDB.sub = userFromCouchDB.name;
        if (payload.email) {
          // we don't want to have an undefined name, since it is equal to not logged in user
          userFromCouchDB.name = payload.email;
        }
        context.commit("SET_USER", userFromCouchDB);
        return axiosResponse;
      })
      .catch((error) => {
        throw error;
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  loginAsGuest: (context: ActionContext<UserState, RootState>) => {
    // force logout, just in case user already logged via the /db interface
    context.commit("SET_USER_LOADING");
    sessionStorage.removeItem(SessionStorageKey.Token);
    logoutTool()
      .then(() => {
        context.commit("SET_USER", {
          name: GUEST_NAME,
          roles: [GUEST_NAME],
        });
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  logout: (context: ActionContext<UserState, RootState>) => {
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
      logoutTool()
        .then(() => {
          context.commit("SET_USER", generateEmptyUser());
        })
        .finally(() => {
          context.commit("UNSET_USER_LOADING");
        });
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
      return getSessionTool()
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
