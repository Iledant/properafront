import Vue from 'vue'
import Router from 'vue-router'
// import SignUp from '@/components/SignUp.vue'
// import SignIn from '@/components/SignIn.vue'
import home from '@/components/Home.vue'
import changePassword from '@/components/Password.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: home
    },
    {
      path: '/ops',
      name: 'PhysicalOps',
      component: () => import('@/components/PhysicalOps.vue')
    },
    {
      path: '/ops_detail',
      component: () => import('@/components/PhysicalOp.vue'),
      name: 'OpDetails'
    },
    {
      path: '/plans',
      name: 'Plans',
      component: () => import('@/components/Plans.vue')
    },
    {
      path: '/planLines/:plan_id(\\d+)',
      component: () => import('@/components/PlanLines.vue'),
      props: true
    },
    // {
    //   path: '/sign_up',
    //   component: SignUp,
    //   name: 'SignUp'
    // },
    // {
    //   path: '/sign_in',
    //   component: SignIn,
    //   name: 'SignIn'
    // },
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/components/Users.vue')
    },
    {
      path: '/password',
      component: changePassword,
      name: 'Password'
    },
    {
      path: '/rights',
      name: 'Rights',
      component: () => import('@/components/Rights.vue')
    },
    {
      path: '/uploads',
      name: 'Uploads',
      component: () => import('@/components/Uploads.vue')
    },
    {
      path: '/annual_prog',
      name: 'AnnualProg',
      component: () => import('@/components/AnnualProg.vue')
    },
    {
      path: '/prev_pre_prog',
      name: 'PrevPreProg',
      component: () => import('@/components/PrevPreProg.vue')
    },
    {
      path: '/action_annual_prog',
      name: 'ActionAnnualProg',
      component: () => import('@/components/ActionAnnualProg.vue')
    },
    {
      path: '/action_payment_prev',
      name: 'ActionPaymentPrev',
      component: () => import('@/components/ActionPaymentPrev.vue')
    },
    {
      path: '/multi_annual_prev',
      name: 'MultiAnnualPrev',
      component: () => import('@/components/MultiAnnualPrev.vue')
    },
    {
      path: '/action_multi_annual_prev',
      name: 'ActionMultiAnnualPrev',
      component: () => import('@/components/ActionMultiAnnualPrev.vue')
    },
    {
      path: '/steps_categories',
      name: 'StepsCategories',
      component: () => import('@/components/StepsCategories.vue')
    },
    {
      path: '/cmt_op_links',
      name: 'CmtOpLinks',
      component: () => import('@/components/CmtOpLinks.vue')
    },
    {
      path: '/cmt_plan_links',
      name: 'CmtPlanLinks',
      component: () => import('@/components/CmtPlanLinks.vue')
    },
    {
      path: '/pendings_op_links',
      name: 'PendingsOpLinks',
      component: () => import('@/components/PendingsOpLinks.vue')
    },
    {
      path: '/beneficiaries',
      name: 'Beneficiaries',
      component: () => import('@/components/Beneficiaries.vue')
    },
    {
      path: '/commissions',
      name: 'Commissions',
      component: () => import('@/components/Commissions.vue')
    },
    {
      path: '/budget',
      name: 'Budget',
      component: () => import('@/components/Budget.vue')
    },
    {
      path: '/budget_credits',
      name: 'BudgetCredits',
      component: () => import('@/components/BudgetCredits.vue')
    },
    // {
    //   path: '/multi_annual_prog',
    //   name: 'MultiAnnualProg',
    //   component: () => import('@/components/MultiAnnualProg.vue'),
    //   beforeEnter: (to, from, next) => {
    //     if (isLoggedIn()) {
    //       next()
    //     } else {
    //       next('/')
    //     }
    //   }
    // },
    // {
    //   path: '/scenarios',
    //   name: 'Scenarios',
    //   component: () => import('@/components/Scenarios.vue'),
    //   beforeEnter: (to, from, next) => {
    //     if (isAdmin()) {
    //       next()
    //     } else {
    //       next('/')
    //     }
    //   }
    // },
    // {
    //   path: '/scenarios/build',
    //   name: 'Scenario',
    //   component: () => import('@/components/Scenario.vue'),
    //   beforeEnter: (to, from, next) => {
    //     if (isAdmin()) {
    //       next()
    //     } else {
    //       next('/')
    //     }
    //   }
    // },
    // {
    //   path: '/settings',
    //   name: 'Settings',
    //   component: () => import('@/components/Settings.vue'),
    //   beforeEnter: (to, from, next) => {
    //     if (isAdmin()) {
    //       next()
    //     } else {
    //       next('/')
    //     }
    //   }
    // },
    {
      path: '/programmings',
      name: 'Programmings',
      component: () => import('@/components/Programming.vue')
    },
    {
      path: '/pre_programmings',
      name: 'PreProgrammings',
      component: () => import('@/components/PreProgramming.vue')
    },
    {
      path: '/payment',
      name: 'Payment',
      component: () => import('@/components/Payment.vue')
    },
    {
      path: '/departments',
      name: 'Departments',
      component: () => import('@/components/Departments.vue')
    },
    {
      path: '/beneficiary',
      name: 'Beneficiary',
      component: () => import('@/components/Beneficiary.vue')
    },
    {
      path: '/multiannual_pmt_prev',
      name: 'MultiAnnualPmtPrev',
      component: () => import('@/components/MultiAnnualPmtPrev.vue')
    },
    {
      path: '/consistency',
      name: 'Consistency',
      component: () => import('@/components/Consistency.vue')
    }
  ]
})
