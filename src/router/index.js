import Vue from 'vue'
import Router from 'vue-router'
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
    {
      path: '/users',
      name: 'Users',
      component: () => import('@/components/Settings/Users.vue')
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
      component: () => import('@/components/Settings/Uploads.vue')
    },
    {
      path: '/annual_prog',
      name: 'AnnualProg',
      component: () => import('@/components/Summaries/AnnualProg.vue')
    },
    {
      path: '/prev_pre_prog',
      name: 'PrevPreProg',
      component: () => import('@/components/Summaries/PrevPreProg.vue')
    },
    {
      path: '/action_annual_prog',
      name: 'ActionAnnualProg',
      component: () => import('@/components/Summaries/ActionAnnualProg.vue')
    },
    {
      path: '/action_payment_prev',
      name: 'ActionPaymentPrev',
      component: () => import('@/components/Summaries/ActionPaymentPrev.vue')
    },
    {
      path: '/multi_annual_prev',
      name: 'MultiAnnualPrev',
      component: () => import('@/components/Summaries/MultiAnnualPrev.vue')
    },
    {
      path: '/action_multi_annual_prev',
      name: 'ActionMultiAnnualPrev',
      component: () => import('@/components/Summaries/ActionMultiAnnualPrev.vue')
    },
    {
      path: '/steps_categories',
      name: 'StepsCategories',
      component: () => import('@/components/Settings/StepsCategories.vue')
    },
    {
      path: '/cmt_op_links',
      name: 'CmtOpLinks',
      component: () => import('@/components/Settings/CmtOpLinks.vue')
    },
    {
      path: '/cmt_plan_links',
      name: 'CmtPlanLinks',
      component: () => import('@/components/Settings/CmtPlanLinks.vue')
    },
    {
      path: '/pendings_op_links',
      name: 'PendingsOpLinks',
      component: () => import('@/components/Settings/PendingsOpLinks.vue')
    },
    {
      path: '/beneficiaries',
      name: 'Beneficiaries',
      component: () => import('@/components/Settings/Beneficiaries.vue')
    },
    {
      path: '/commissions',
      name: 'Commissions',
      component: () => import('@/components/Settings/Commissions.vue')
    },
    {
      path: '/budget',
      name: 'Budget',
      component: () => import('@/components/Settings/Budget.vue')
    },
    {
      path: '/budget_credits',
      name: 'BudgetCredits',
      component: () => import('@/components/Settings/BudgetCredits.vue')
    },
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
      component: () => import('@/components/Summaries/MultiAnnualPmtPrev.vue')
    },
    {
      path: '/consistency',
      name: 'Consistency',
      component: () => import('@/components/Settings/Consistency.vue')
    },
    {
      path: '/payment_demands',
      name: 'PaymentDemands',
      component: () => import('@/components/Settings/PaymentDemands.vue')
    }
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
  ]
})
