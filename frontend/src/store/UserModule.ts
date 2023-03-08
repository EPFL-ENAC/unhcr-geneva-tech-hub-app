import {
  getSessionWithCookie,
  loginDefault,
  loginJWT,
  logoutCookie,
} from "@/utils/couchdb";
import { SessionStorageKey } from "@/utils/storage";

import axios, { AxiosError, AxiosResponse } from "axios";
import { v4 as uuidv4 } from "uuid";

import {
  ActionContext,
  ActionTree,
  GetterTree,
  Module,
  MutationTree,
} from "vuex";
import { RootState } from ".";

/** Config store */

export enum Roles {
  user = "user",
  admin = "admin",
  _admin = "_admin", // dbAdmin
  specialist = "specialist",
  // "author" // does not exist, it's in the document if user is in the users field
}
interface AzureError {
  correlation_id: string;
  error: string;
  error_codes: number[];
  error_description: string;
  timestamp: string;
  trade_id: string;
}

export const GUEST_NAME = "guest";
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

function setuptokens(response: AxiosResponse): void {
  const { id_token, refresh_token, access_token } = response.data;
  sessionStorage.setItem(SessionStorageKey.Token, id_token);
  sessionStorage.setItem(SessionStorageKey.Refresh, refresh_token);
  sessionStorage.setItem(SessionStorageKey.Access, access_token);

  // clean verifier, challenge and state
  sessionStorage.removeItem("state");
  sessionStorage.removeItem("verifier");
  sessionStorage.removeItem("challenge");
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
      name: value.name ?? null,
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
  login: async (
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
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  verifyCode: async (
    context: ActionContext<UserState, RootState>,
    { code, code_verifier }
  ) => {
    const state = sessionStorage.getItem("state") ?? "";

    try {
      const suffix = window.location.hostname === "localhost" ? "" : "/auth";
      const response = await axios.post(
        `https://login.microsoftonline.com/${process.env.VUE_APP_AUTH_TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
          grant_type: "authorization_code",
          code,
          code_verifier, // web_message ?
          state,
          redirect_uri: window.location.origin + suffix,
        }),
        {
          headers: {
            Accept: "application/x-www-form-urlencoded",
          },
          withCredentials: false,
        }
      );
      setuptokens(response);
      return response;
    } catch (error: AxiosError<unknown, unknown> | unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const data: AzureError = error?.response?.data as AzureError;
        context.dispatch(
          {
            title: `${error.message}:`,
            message: `${
              data?.error_description ?? "unknown error_description"
            }`,
            type: "error",
          },
          { root: true }
        );
      }
      throw new Error("token failed" + JSON.stringify(error));
    }
  },
  refreshToken: async (context: ActionContext<UserState, RootState>) => {
    try {
      const response = await axios.post(
        `https://login.microsoftonline.com/${process.env.VUE_APP_AUTH_TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token:
            sessionStorage.getItem(SessionStorageKey.Refresh) ?? "",
        }),
        {
          headers: {
            Accept: "application/x-www-form-urlencoded",
          },
          withCredentials: false,
        }
      );
      setuptokens(response);
      context.dispatch("loginToken", {
        token: response.data.id_token,
        byPassLoading: true,
      });

      context.dispatch(
        "notifyUser",
        {
          title: `refresh token:`,
          message: `Successfully refreshed token for user: ${JSON.stringify(
            context.getters?.user?.name
          )}`,
          type: "info",
        },
        { root: true }
      );
    } catch (error: AxiosError<unknown, unknown> | unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const data: AzureError = error?.response?.data as AzureError;
        context.dispatch(
          "notifyUser",
          {
            title: `${error.message}:`,
            message: `${
              data?.error_description ?? "unknown error_description"
            }`,
            type: "error",
          },
          { root: true }
        );
      }
      throw new Error("token failed" + JSON.stringify(error));
    }
  },
  silentLoginToken: async (
    context: ActionContext<UserState, RootState>,
    { byPassLoading }
  ) => {
    if (!byPassLoading) {
      context.commit("SET_USER_LOADING");
    }
    // not working because response_type id_token, token was not allowed;
    try {
      const suffix = window.location.hostname === "localhost" ? "" : "/auth";
      const url: URL = new URL(
        `https://login.microsoftonline.com/${process.env.VUE_APP_AUTH_TENANT_ID}/oauth2/v2.0/authorize`
      );
      url.searchParams.append("client_id", process.env.VUE_APP_AUTH_CLIENT_ID);
      url.searchParams.append("nonce", uuidv4());
      url.searchParams.append("response_type", "token id_token");
      url.searchParams.append("redirect_uri", window.location.origin + suffix);
      const state = uuidv4();
      url.searchParams.append("state", state);
      sessionStorage.setItem("state", state);
      url.searchParams.append("scope", "openid email profile offline_access");
      url.searchParams.append("response_mode", "web_message"); // web_message ?
      url.searchParams.append("prompt", "none");
      const response = await axios.get(url.href);

      setuptokens(response);
      return response;
    } catch (error: AxiosError<unknown, unknown> | unknown) {
      if (axios.isAxiosError(error) && error.response) {
        const data: AzureError = error?.response?.data as AzureError;
        context.dispatch(
          "notifyUser",
          {
            title: `${error.message}:`,
            message: `${
              data?.error_description ?? "unknown error_description"
            }`,
            type: "error",
          },
          { root: true }
        );
      }
      throw new Error("token failed" + JSON.stringify(error));
    }
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
      .catch((response: unknown) => {
        context.dispatch(
          "notifyUser",
          {
            message: response,
            type: "error",
          },
          { root: true }
        );
        // should remove token also!!
        context.commit("SET_USER", generateEmptyUser());
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
      const redirectURI = encodeURIComponent(window.location.origin);
      window.location.href = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${redirectURI}`;
    } else {
      await logoutCookie();
      context.commit("SET_USER", generateEmptyUser());
      context.commit("UNSET_USER_LOADING");
    }
  },
  getSession: (
    context: ActionContext<UserState, RootState>,
    { byPassLoading }
  ) => {
    // if user logged in as guest no session needed!
    const currentUser: CouchUser = context.getters["user"];
    // check session only if currentUser is loaded true
    if (
      currentUser.loaded === false ||
      currentUser.name === null ||
      currentUser.name === undefined ||
      currentUser.name === "" // legacy could happen when initializing a user
    ) {
      // no name: no authentication do nothing
      return;
    }

    const sessionStorageToken = sessionStorage.getItem(SessionStorageKey.Token);
    if (sessionStorageToken) {
      // we're a oauth user
      return context.dispatch("loginToken", {
        token: sessionStorageToken,
        byPassLoading,
      });
    }

    if (
      typeof currentUser.name === "string" &&
      currentUser.name !== GUEST_NAME
    ) {
      // we're not a guest user nor a oauth user but a normal user (couchdb user)
      if (!byPassLoading) {
        context.commit("SET_USER_LOADING");
      }
      return getSessionWithCookie()
        .then((response) => {
          const user = response.data;
          context.commit("SET_USER", user.userCtx);
        })
        .finally(() => {
          context.commit("UNSET_USER_LOADING");
        });
    }
    return; // probably guest
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
