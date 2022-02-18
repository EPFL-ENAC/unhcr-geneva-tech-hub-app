import Vue, { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

// DB admin
function update(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
  const initialDisplayValue = el.getAttribute("__previousStyleDisplay");

  const store = vnode?.context?.$store;
  const user = store?.getters["UserModule/user"];
  const isUserAdmin = user.roles.indexOf("_admin") >= 0;

  el.style.display = isUserAdmin ? initialDisplayValue || "" : "none";
}

export default Vue.directive("show-if-super-admin", {
  bind: function (el, binding, vnode) {
    el.setAttribute("__previousStyleDisplay", el.style.display);
    update(el, binding, vnode);
  },
  update,
});
