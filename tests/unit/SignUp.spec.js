import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import SignUp from '@/components/SignUp.vue'
import { attachApp } from '../utils'

const localVue = createLocalVue()

describe('SignUp', () => {
  let vuetify
  let store
  let _url
  let _payload
  const mountFunction = options =>
    mount(SignUp, {
      localVue,
      vuetify,
      store,
      mocks: {
        $http: {
          async post (url, payload) {
            _url = url
            _payload = payload
            return { status: 400 }
          }
        }
      },
      ...options
    })
  attachApp(document)
  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({ getters: { loading: () => true } })
  })

  it('should not render if value isn\'t passed', () => {
    const wrapper = mountFunction({ propsData: { value: false } })
    expect(wrapper).toMatchSnapshot()
  })

  it('should be disable if fields are improperly filled', async () => {
    const wrapper = mountFunction({ propsData: { value: true } })
    const tests = [
      { disabled: true, values: { name: '', password: '', email: '' } },
      { disabled: true, values: { name: 'nom', password: '', email: '' } },
      {
        disabled: true,
        values: { name: 'nom', password: 'password', email: '' }
      },
      {
        disabled: true,
        values: { name: 'nom', password: '', email: 'email' }
      },
      {
        disabled: true,
        values: { name: 'nom', password: 'password', email: 'email' }
      },
      {
        disabled: true,
        values: { name: '', password: 'password', email: 'email' }
      },
      {
        disabled: false,
        values: { name: 'nom', password: 'password', email: 'email@gmail.com' }
      }
    ]
    for (const l of tests) {
      wrapper.setData(l.values)
      wrapper.vm.$nextTick()
      expect(wrapper.vm.disabled).toBe(l.disabled)
    }
  })

  it('should render if value is true and submit when fields are ok', async () => {
    const wrapper = mountFunction({ propsData: { value: true } })
    expect(wrapper.find('.v-dialog__content').exists()).toBe(true)
    const nameInput = wrapper.find('[data-cy=signUpFullName]')
    nameInput.setValue('nom')
    const emailInput = wrapper.find('[data-cy=signUpEmail]')
    emailInput.setValue('email@gmail.com')
    const passwordInput = wrapper.find('[data-cy=signUpPassword]')
    passwordInput.setValue('password')
    await wrapper.vm.$nextTick()
    await wrapper.find('[data-cy=signUpOk]').trigger('click')
    expect(_url).toBe('user/signup')
    expect(_payload).toMatchObject(
      { name: 'nom', password: 'password', email: 'email@gmail.com' })
  })
})
