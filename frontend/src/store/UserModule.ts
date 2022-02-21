import { login as loginTool, logout as logoutTool } from "@/utils/couchdb";
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
  // "author" // does not exist, it's in the document
}

export interface CouchUser {
  name: string;
  roles: Roles[];
}
interface UserState {
  user: CouchUser;
  userLoading: boolean;
}

export interface UserCouchCredentials {
  username: string;
  password: string;
}

function generateEmptyUser(): CouchUser {
  return { name: "", roles: [] };
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
  SET_USER(state, value) {
    const name = value.name ?? "";
    const roles = value.roles ?? [];
    state.user = { name, roles };
  },
  SET_USER_LOADING(state) {
    state.userLoading = true;
  },
  UNSET_USER_LOADING(state) {
    state.userLoading = false;
  },
};

/** Action */
const actions: ActionTree<UserState, RootState> = {
  login: (
    context: ActionContext<UserState, RootState>,
    credentials: UserCouchCredentials
  ) => {
    context.commit("SET_USER_LOADING");
    const { username, password } = credentials;
    return loginTool(username, password)
      .then((axiosResponse) => {
        console.log("login sucess", axiosResponse.data);
        context.commit("SET_USER", axiosResponse.data);
        return axiosResponse;
      })
      .catch((error) => {
        console.log("gross eerru", error);
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  logout: (context: ActionContext<UserState, RootState>) => {
    context.commit("SET_USER_LOADING");
    logoutTool()
      .then((response) => {
        console.log("logout", response);
        context.commit("SET_USER", generateEmptyUser());
      })
      .finally(() => {
        context.commit("UNSET_USER_LOADING");
      });
  },
  getSession: (context: ActionContext<UserState, RootState>) => {
    fetch("http://localhost:5984/_session", {
      method: "get",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then((result) => result.json())
      .then((response) => {
        console.log(response.userCtx);
        context.commit("SET_USER", response.userCtx);
      });
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
