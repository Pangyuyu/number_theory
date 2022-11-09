import Main from "@/layouts/main.vue";
const home = {
  path: "/",
  name: "home",
  component:Main,
  redirect: '/home/index',
  children: [
    {
      path: "/home/index",
      name: "menuHome",
      component: () => import("@/view/home/index.vue")
    },
  ],
};
export default home;
