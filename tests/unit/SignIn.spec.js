import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import * as types from '@/store/mutation-types'
import Vuetify from 'vuetify'
import SignIn from '@/components/SignIn.vue'
import { attachApp } from '../utils'

const localVue = createLocalVue()

describe('SignIn', () => {
  let vuetify
  let store
  let _email
  let _password
  const mountFunction = options =>
    mount(SignIn, {
      localVue,
      vuetify,
      store,
      ...options
    })
  attachApp(document)
  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
      getters: { loading: () => true },
      actions: {
        async [types.SIGN_IN] ({ commit }, { email, password }) {
          _email = email
          _password = password
        }
      }
    })
  })

  it('should not render if value isn\'t passed', () => {
    const wrapper = mountFunction({ propsData: { value: false } })
    expect(wrapper).toMatchSnapshot()
  })

  it('should be disable if fields are improperly filled', async () => {
    const wrapper = mountFunction({ propsData: { value: true } })
    const tests = [
      { disabled: true, values: { email: '', password: '' } },
      { disabled: true, values: { email: 'nom@gmail.com', password: '' } },
      { disabled: true, values: { email: '', password: 'password' } },
      { disabled: false, values: { email: 'nom@gmail.com', password: 'password' } }
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
    const emailInput = wrapper.find('[data-cy=email]')
    emailInput.setValue('email@gmail.com')
    const passwordInput = wrapper.find('[data-cy=password]')
    passwordInput.setValue('password')
    await wrapper.vm.$nextTick()
    await wrapper.find('[data-cy=logIn]').trigger('click')
    expect(_email).toBe('email@gmail.com')
    expect(_password).toBe('password')
  })
})
