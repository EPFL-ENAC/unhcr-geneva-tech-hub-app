import { env } from "@/config";
import Confirm from "@/views/ConfirmView.vue";
import ForgotPassword from "@/views/ForgotPasswordView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import ResetPassword from "@/views/ResetPasswordView.vue";
import Unconfirm from "@/views/UnconfirmView.vue";

const baseRoute = [];
if (env.VUE_APP_ENVIRONEMENT === "local") {
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
} else {
  baseRoute.push({
    path: "/login",
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
      Register,
    },
  },
  {
    path: "/Confirm",
    name: "Confirm",
    meta: {
      title: "Confirm",
    },
    components: {
      Confirm,
    },
  },
  {
    path: "/Unconfirm",
    name: "Unconfirm",
    meta: {
      title: "Unconfirm",
    },
    components: {
      Unconfirm,
    },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    meta: {
      title: "Reset password",
    },
    components: {
      ResetPassword,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    meta: {
      title: "Forgot password",
    },
    components: {
      ForgotPassword,
    },
  },
  {
    path: "/auth",
    redirect: "/login",
  },
];
