import {
  ExpireError,
  getSessionWithCookie,
  loginDefault,
  loginJWT,
  logoutCookie,
} from "@/utils/couchdb";
import { SessionStorageKey } from "@/utils/storage";

import axios from "axios";

import { env } from "@/config";
import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState, UnhcrNotification } from ".";

export class UnhcrNotificationError extends Error {
  constructor(m: UnhcrNotification) {
    super(m.message);
    this.title = m.title;
    this.date = m.date;
    this.type = m.type;
    this.stack = m.stack;
    this.expire = m.expire;
    this.message = m.message;
    this.name = m.name;
    Object.setPrototypeOf(this, Error.prototype); // restore prototype chain
  }

  title?: string | undefined;
  message: string;
  date?: string | undefined; // as new Date(),
  type?: string | undefined; // error/warning/info;
  stack?: string | undefined;
  expire?: number | undefined; // timestamp in ms in the future (new Date()).getTime() + 5000)
  name: string;
}

/** Config store */

export const GUEST_NAME = "guest";
export enum Roles {
  user = "user", // Deprecated not used anymore
  admin = "admin", // user admin
  _admin = "_admin", // dbAdmin
  unconfirmed = "unconfirmed", // Deprecated from registering rest-api
  specialist = "specialist", // deprecated
  guest = "guest", // frontend only
}

export interface CouchUser {
  name?: string | null;
  sub?: string;
  roles?: Roles[];
  loaded?: boolean;
}
export interface UserState {
  user: CouchUser;
  userLoading: boolean;
}

export interface UserCouchCredentials {
  username: string; // should be an email
  password: string;
}

export interface UserPassword {
  password: string;
}

export interface CredentialsWithToken {
  credentials: UserPassword;
  token: string;
}

export interface PasswordWithToken {
  password: string;
  token: string;
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

export function removeAllOauthTokens(): void {
  sessionStorage.removeItem(SessionStorageKey.Token);
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
      loaded?: boolean;
    }
  ) {
    state.user = {
      name: value.name ?? null,
      sub: value.sub,
      roles: value.roles ? (value.roles as unknown as Roles[]) : [],
      loaded: value.loaded ?? false,
    };
    return state.user;
  },
  SET_USER_LOADING(state) {
    state.userLoading = true;
    state.user.loaded = false;
  },
  UNSET_USER_LOADING(state) {
    state.userLoading = false;
    state.user.loaded = true;
  },
  UNSET_USER_LOADING_UNIQUELY(state) {
    state.userLoading = false;
  },
};

/** Action */
const actions: ActionTree<UserState, RootState> = {
  login: async (
    context: ActionContext<UserState, RootState>,
    credentials: UserCouchCredentials
  ) => {
    context.commit("SET_USER_LOADING");
    // removeItem: idea was to remove azure authentication info
    // it is biased: we trigger a warning and logout for azure first
    removeAllOauthTokens();
    const { username, password } = credentials;
    return loginDefault(username, password)
      .then((axiosResponse) => {
        if (axiosResponse.data.roles.includes("unconfirmed")) {
          throw new Error(
            "User unconfirmed, check your emails or register again",
            axiosResponse.data
          );
        }
        context.commit("SET_USER", axiosResponse.data);
        return axiosResponse;
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  loginToken: async (
    context: ActionContext<UserState, RootState>,
    { token, byPassLoading }
  ) => {
    if (!byPassLoading) {
      context.commit("SET_USER_LOADING");
    }
    return loginJWT(token)
      .then((response) => {
        context.commit("SET_USER", response.data);
        return response;
      })
      .catch(async (response: Error | ExpireError) => {
        context.commit("SET_USER", generateEmptyUser());
        // if (response instanceof ExpireError) {
        await context.dispatch(
          "notifyUser",
          {
            message: response,
            stack: response.stack,
          },
          { root: true }
        );
        throw response;
      })
      .finally(async () => {
        await context.dispatch("setLoading", false, { root: true });
        context.commit("UNSET_USER_LOADING");
      });
  },
  register: async (
    context: ActionContext<UserState, RootState>,
    credentials
  ) => {
    context.commit("SET_USER_LOADING");
    // removeItem: idea was to remove azure authentication info
    // it is biased: we trigger a warning and logout for azure first
    removeAllOauthTokens();
    const { username, password } = credentials;
    let response;
    try {
      response = await axios.post(
        `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_API_URL}/register`,
        { name: username, password },
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } finally {
      context.commit("UNSET_USER_LOADING");
    }
    return response;
  },
  forgotPasswordCouchdb: async (
    context: ActionContext<UserState, RootState>,
    payload: UserCouchCredentials
  ) => {
    context.commit("SET_USER_LOADING");
    // removeItem: idea was to remove azure authentication info
    // it is biased: we trigger a warning and logout for azure first
    removeAllOauthTokens();
    let response;
    try {
      response = await axios.post(
        `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_API_URL}/forgot-password`,
        { name: payload.username },
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } finally {
      context.commit("UNSET_USER_LOADING");
    }
    return response;
  },
  resetPassword: async (
    context: ActionContext<UserState, RootState>,
    payload: CredentialsWithToken
  ) => {
    context.commit("SET_USER_LOADING");
    // removeItem: idea was to remove azure authentication info
    // it is biased: we trigger a warning and logout for azure first
    removeAllOauthTokens();
    const { password } = payload.credentials;
    let response;
    try {
      response = await axios.post(
        `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_API_URL}/reset-password`,
        { password, token: payload.token },
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } finally {
      context.commit("UNSET_USER_LOADING");
    }
    return response;
  },
  confirmPasswordCouchdb: async (
    context: ActionContext<UserState, RootState>,
    payload: PasswordWithToken
  ) => {
    context.commit("SET_USER_LOADING");
    // removeItem: idea was to remove azure authentication info
    // it is biased: we trigger a warning and logout for azure first
    removeAllOauthTokens();
    let response;
    try {
      response = await axios.post(
        `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_API_URL}/confirm-registration`,
        payload,
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } finally {
      context.commit("UNSET_USER_LOADING");
    }
    return response;
  },
  sendConfirmCouchdb: async (
    context: ActionContext<UserState, RootState>,
    payload: Record<string, string>
  ) => {
    context.commit("SET_USER_LOADING");
    // removeItem: idea was to remove azure authentication info
    // it is biased: we trigger a warning and logout for azure first
    removeAllOauthTokens();
    let response;
    try {
      response = await axios.post(
        `${env.BASE_URL_WITHOUT_SLASH}${env.VUE_APP_API_URL}/send-confirmation`,
        payload,
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } finally {
      context.commit("UNSET_USER_LOADING");
    }
    return response;
  },
  loginAsGuest: async (context: ActionContext<UserState, RootState>) => {
    // force logout, just in case user already logged via the /db interface
    context.commit("SET_USER_LOADING");
    removeAllOauthTokens();
    // try catch await in case of problem
    try {
      await logoutCookie();
      context.commit("SET_USER", {
        name: GUEST_NAME,
        roles: [GUEST_NAME],
      });
    } catch (e) {
      context.commit("SET_USER", generateEmptyUser());
      context.commit("UNSET_USER_LOADING");
      throw e;
    } finally {
      await context.dispatch("setLoading", false, { root: true });
      context.commit("UNSET_USER_LOADING");
    }
  },
  logout: async (context: ActionContext<UserState, RootState>) => {
    context.commit("SET_USER_LOADING");
    // we should logout from everywhere
    // start with cookie
    try {
      await logoutCookie();
      context.commit("SET_USER", generateEmptyUser());
    } catch (e) {
      context.commit("SET_USER", generateEmptyUser());
      throw e;
    } finally {
      context.commit("UNSET_USER_LOADING");
    }
    // then do the oauth logout
    const sessionStorageToken = sessionStorage.getItem(SessionStorageKey.Token);
    if (context.getters.user?.sub || sessionStorageToken) {
      // force local state to empty then redirect to unhcr
      // if unhcr logout does not work at least, our ux will show as unlogged
      context.commit("SET_USER", generateEmptyUser());
      context.commit("UNSET_USER_LOADING");
      removeAllOauthTokens();
      // const redirectURI = encodeURIComponent(window.location.origin);
      // window.location.href = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${redirectURI}`;
      const redirectUri =
        window.authModule.myMSALObj.getConfiguration()?.auth?.redirectUri;
      const logoutRequest = {
        account: window.authModule.myMSALObj.getActiveAccount(),
        postLogoutRedirectUri: redirectUri,
      };

      window.authModule.logout(logoutRequest);
    }
  },
  getSession: async (
    context: ActionContext<UserState, RootState>,
    { byPassLoading }
  ) => {
    // if user logged in as guest no session needed!
    // const currentUser: CouchUser = context.getters["user"];
    const sessionStorageToken = sessionStorage.getItem(SessionStorageKey.Token);
    // we're not a guest user nor a oauth user but a normal user (couchdb user)
    if (!byPassLoading) {
      context.commit("SET_USER_LOADING");
    }
    const userCouchDB = await getSessionWithCookie()
      .then((response) => {
        const user = response.data;
        try {
          // if we bypass, we don't refresh
          if (byPassLoading) {
            user.userCtx.loaded = true;
            context.commit("UNSET_USER_LOADING_UNIQUELY");
          }
          // Find a way to pass user.info.authenticated (jwt/cookie/default) to userCTX
          // userCtx either has a name === null or a name === user.name
          context.commit("SET_USER", user.userCtx);
        } catch (e: unknown) {
          console.error(e);
        }
        return user.userCtx;
      })
      .catch((e: unknown) => {
        // ExpireError mostly we should try to refresh
        throw e;
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
    if (userCouchDB?.name !== null) {
      // we're a couchdb user, we have priority
      return userCouchDB;
    }
    // const sessionStorageToken = sessionStorage.getItem(SessionStorageKey.Token);
    if (sessionStorageToken) {
      // we're a oauth user
      try {
        const resp = await context.dispatch("loginToken", {
          token: sessionStorageToken,
          byPassLoading,
        });
        return resp.data;
      } catch (e: unknown) {
        // ExpireError mostly we should try to refresh
        if (env.VUE_APP_ENVIRONEMENT !== "production") {
          console.trace(e);
        }
        // We don't throw the error, we want to keep the user not logged in (as a guest user below)
      } finally {
        context.commit("UNSET_USER_LOADING");
      }
    }
    // we're a guest user
    context.commit("SET_USER", {
      name: GUEST_NAME,
      roles: [GUEST_NAME],
    });
    context.commit("UNSET_USER_LOADING");
    return context.getters.user;
    // we don't return guest userCtx, we override it with our custom
    // return userCouchDB;
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
