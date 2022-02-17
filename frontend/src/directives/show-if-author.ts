import Vue, { VNode } from "vue";
import { DirectiveBinding } from "vue/types/options";

function update(el: HTMLElement, binding: DirectiveBinding, vnode: VNode) {
  const initialDisplayValue = el.getAttribute("__previousStyleDisplay");

  const store = vnode?.context?.$store;
  const user = store?.getters["UserModule/user"];
  // priority 1: binding is the project object

  const isUserAuthor = binding.value.authors.indexOf(user.name) >= 0;

  el.style.display = isUserAuthor ? initialDisplayValue || "" : "none";
}

export default Vue.directive("show-if-author", {
  bind: function (el, binding, vnode) {
    el.setAttribute("__previousStyleDisplay", el.style.display);
    update(el, binding, vnode);
  },
  update,
});
