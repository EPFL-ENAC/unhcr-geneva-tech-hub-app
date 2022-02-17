// possible inspiration: https://codeburst.io/reusable-vue-directives-v-can-753bf54e563f
// SHOW IF USER is logged in meaning: name field is not empty

import Vue, { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

function update(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
  const initialDisplayValue = el.getAttribute("__previousStyleDisplay");

  const store = vnode?.context?.$store;
  const user = store?.getters["UserModule/user"];
  const isUserLoggedIn = user.name.length > 0;

  el.style.display = isUserLoggedIn ? initialDisplayValue || "" : "none";
}

export default Vue.directive("show-if-user", {
  bind: function (el, binding, vnode) {
    el.setAttribute("__previousStyleDisplay", el.style.display);
    update(el, binding, vnode);
  },
  update,
});
