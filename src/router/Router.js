import Chats from '../pages/Chats.vue'
import Signup from '../pages/Signup.vue'
import Products from '../pages/Products.vue'
import Signin from '../pages/SignIn.vue'
import UserSettings from "../pages/UserSettings.vue";
import Admin from "../pages/Admin.vue";
import SignupOrganization from "../pages/SignupOrganization.vue";
import Groups from "../pages/Groups.vue";
import Organization from "../pages/Organization.vue";
import SettingsOrganization from "../pages/SettingsOrganization.vue";
import Group from "../pages/Group.vue";
import Briefcases from "../pages/Briefcases.vue";
import BriefcaseIndividual from "../pages/BriefcaseIndividual.vue";
import Mercado from "../pages/Mercado.vue"
import AssetIndividual from "../pages/AssetIndividual.vue";

import { getCookie } from '../pages/helpers/helpers';
import { createRouter, createWebHistory } from "vue-router"

const routeInfos = [
    {
        path: "/",
        name: 'Products',
        component: Products
    },
    {
        path: "/signup",
        component: Signup
    },
    {
        path: "/signin",
        name: 'Login',
        component: Signin
    },
    {
        path: "/chats",
        component: Chats
    },
    {
        path: "/settings",
        component: UserSettings
    },
    {
        path: "/admin",
        component: Admin
    },
    {
        path: "/signupOrganization",
        component: SignupOrganization
    },
    {
        path: "/community",
        component: Groups
    },
    {
        path: "/organization",
        component: Organization
    },
    {
        path: "/settingsOrganization",
        component: SettingsOrganization
    },
    {
        path: "/group/:id",
        name: "Group",
        component: Group,
        props: (route) => ({ id: route.params.id })
      },
      {
          path: "/briefcases",
          component: Briefcases
      },
      {
          path: "/briefcase-ndividual/:id",
          name: "BriefcaseIndividual",
          component: BriefcaseIndividual,
          props: (route) => ({ id: route.params.id })
        },
        {
            path: "/mercado",
            component: Mercado
        },
        {
            path: "/asset-ndividual/:id",
            name: "AssetIndividual",
            component: AssetIndividual,
            props: (route) => ({ id: route.params.id })
          }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routeInfos
})


router.beforeEach(async (to) => {
    const publicPages = ['/signin','/','/signup', '/signupOrganization'];
    const publicNames = ['Items'];
    let authRequired = !publicPages.includes(to.path);
    const auth = getCookie('token');

    if(authRequired){
        authRequired = !publicNames.includes(to.name);
    }

    if (authRequired && !(auth !== "")) {
        return '/signin';
    }     
});

export default router;