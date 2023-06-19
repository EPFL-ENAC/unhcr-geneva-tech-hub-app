import ChangePassword from "@/views/ChangePasswordView.vue";
import Confirm from "@/views/ConfirmView.vue";
import ForgotPassword from "@/views/ForgotPasswordView.vue";
import Login from "@/views/LoginView.vue";
import Register from "@/views/RegisterView.vue";
import Unconfirm from "@/views/UnconfirmView.vue";

export default [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "Login",
    },
    components: {
      Login,
    },
  },
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
    path: "/ChangePassword",
    name: "ChangePassword",
    meta: {
      title: "ChangePassword",
    },
    components: {
      ChangePassword,
    },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    meta: {
      title: "ForgotPassword",
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
