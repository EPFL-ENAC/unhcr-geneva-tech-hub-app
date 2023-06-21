import {
  ExpireError,
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

function removeJwtTempTokens(): void {
  // clean verifier, challenge and state
  sessionStorage.removeItem("state");
  // we don't remove verifier, we wait for the user to erase it
  sessionStorage.removeItem("challenge");
}

function removeAllOauthTokens(): void {
  removeJwtTempTokens();
  sessionStorage.removeItem(SessionStorageKey.Token);
  sessionStorage.removeItem(SessionStorageKey.Refresh);
  sessionStorage.removeItem(SessionStorageKey.Access);
}

function setuptokens(response: AxiosResponse): void {
  const { id_token, refresh_token, access_token } = response.data;
  sessionStorage.setItem(SessionStorageKey.Token, id_token);
  sessionStorage.setItem(SessionStorageKey.Refresh, refresh_token);
  sessionStorage.setItem(SessionStorageKey.Access, access_token);
  removeJwtTempTokens();
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

function handleAzureError(
  context: ActionContext<UserState, RootState>,
  error: AxiosError<unknown, unknown> | unknown
): void {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data: AzureError = error?.response?.data as AzureError;
    context.dispatch(
      "notifyUser",
      {
        title: `${data.error}`,
        message: `${data?.error_description ?? "unknown error_description"}`,
        stack: JSON.stringify(data),
        type: "error",
      },
      { root: true }
    );
    // remove token because of error
    removeAllOauthTokens();
  }
  throw error;
}

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
          throw new Error("User unconfirmed, check your emails or register again", axiosResponse.data)
        }
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
      handleAzureError(context, error);
    }
  },
  refreshToken: async (
    context: ActionContext<UserState, RootState>,
    { byPassLoading } = { byPassLoading: true }
  ) => {
    try {
      const refresh_token =
        sessionStorage.getItem(SessionStorageKey.Refresh) ?? undefined;
      if (refresh_token === undefined) {
        return;
      }
      const response = await axios.post(
        `https://login.microsoftonline.com/${process.env.VUE_APP_AUTH_TENANT_ID}/oauth2/v2.0/token`,
        new URLSearchParams({
          client_id: process.env.VUE_APP_AUTH_CLIENT_ID,
          grant_type: "refresh_token",
          refresh_token,
        }),
        {
          headers: {
            Accept: "application/x-www-form-urlencoded",
          },
          withCredentials: false,
        }
      );
      setuptokens(response);
      await context.dispatch("loginToken", {
        token: response.data.id_token,
        byPassLoading: true,
      });

      await context.dispatch(
        "notifyUser",
        {
          title: `refresh token:`,
          message: `Successfully refreshed token for user: ${JSON.stringify(
            context.getters?.user?.name
          )}`,
          byPassLoading,
          type: "info",
        },
        { root: true }
      );
    } catch (error: AxiosError<unknown, unknown> | unknown) {
      handleAzureError(context, error);
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
      handleAzureError(context, error);
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
      .catch((response: Error | ExpireError) => {
        context.commit("SET_USER", generateEmptyUser());
        if (response instanceof ExpireError) {
          // TODO: should remove token also
          context.dispatch(
            "notifyUser",
            {
              message: response,
              // type: response.type ?? "error",
              stack: response.stack,
            },
            { root: true }
          );
          return response;
        } else {
          throw response;
        }
      })
      .finally(() => {
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
        `/api/register`,
        { name: username, password },
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error: AxiosError<unknown, unknown> | unknown) {
      console.error(error);
    }
    context.commit("UNSET_USER_LOADING");
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
        `/api/forgot-password`,
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
    try {
      const response = await axios.post(
        `/api/reset-password`,
        { password, token: payload.token },
        {
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error: AxiosError<unknown, unknown> | unknown) {
      console.error(error);
    }
    context.commit("UNSET_USER_LOADING");
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
      response = await axios.post(`/api/confirm-registration`, payload, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      });
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
      response = await axios.post(`/api/send-confirmation`, payload, {
        headers: {
          Accept: "application/json",
        },
        withCredentials: true,
      });
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
      context.commit("UNSET_USER_LOADING");
    }
  },
  logout: async (context: ActionContext<UserState, RootState>) => {
    context.commit("SET_USER_LOADING");
    removeAllOauthTokens();
    if (context.getters.user.sub) {
      // force local state to empty then redirect to unhcr
      // if unhcr logout does not work at least, our ux will show as unlogged
      context.commit("SET_USER", generateEmptyUser());
      context.commit("UNSET_USER_LOADING");
      const redirectURI = encodeURIComponent(window.location.origin);
      window.location.href = `https://login.microsoftonline.com/common/oauth2/logout?post_logout_redirect_uri=${redirectURI}`;
    } else {
      try {
        await logoutCookie();
        context.commit("SET_USER", generateEmptyUser());
      } catch (e) {
        context.commit("SET_USER", generateEmptyUser());
        throw e;
      } finally {
        context.commit("UNSET_USER_LOADING");
      }
    }
  },
  getSession: async (
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
      return await context.dispatch("loginToken", {
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
      return await getSessionWithCookie()
        .then((response) => {
          const user = response.data;
          try {
            // if we bypass, we don't refresh
            if (byPassLoading) {
              user.userCtx.loaded = true;
              context.commit("UNSET_USER_LOADING_UNIQUELY");
            }
            // TODO: pass user.info.authenticated (jwt/cookie/default) to userCTX
            context.commit("SET_USER", user.userCtx);
          } catch (e: unknown) {
            console.error(e);
          }
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
