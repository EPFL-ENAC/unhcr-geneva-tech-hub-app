import { env } from "@/config";
import Confirm from "@/views/ConfirmView.vue";
import ForgotPassword from "@/views/ForgotPasswordView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import ResetPassword from "@/views/ResetPasswordView.vue";
import Unconfirm from "@/views/UnconfirmView.vue";
import UserMeView from "@/views/UserMeView.vue";

const baseRoute = [];
if (env.VUE_APP_DEACTIVATE_LOGIN_PAGE !== "true") {
  baseRoute.push({
    path: "/login",
    name: "Login",
    meta: {
      title: "Login",
    },
    components: {
      Login,
    },
  });
  baseRoute.push({
    path: "/me",
    name: "Me",
    meta: {
      title: "Me",
    },
    components: {
      default: UserMeView,
    },
  });
} else {
  baseRoute.push({
    path: "/login",
    name: "LoginRedirectToApps",
    redirect: "/apps",
  });
}

export default [
  ...baseRoute,
  {
    path: "/Register",
    name: "Register",
    meta: {
      title: "Register",
    },
    components: {
      default: Register,
    },
  },
  {
    path: "/Confirm",
    name: "Confirm",
    meta: {
      title: "Confirm",
    },
    components: {
      default: Confirm,
    },
  },
  {
    path: "/Unconfirm",
    name: "Unconfirm",
    meta: {
      title: "Unconfirm",
    },
    components: {
      default: Unconfirm,
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    meta: {
      title: "Reset password",
    },
    components: {
      default: ResetPassword,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    meta: {
      title: "Forgot password",
    },
    components: {
      default: ForgotPassword,
    },
  },
  {
    path: "/auth",
    redirect: "/login",
  },
];
