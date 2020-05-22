import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Vuetify from 'vuetify'
import SignUp from '@/components/SignUp.vue'

const localVue = createLocalVue()

describe('SignUp', () => {
  let vuetify
  let store

  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({ getters: { loading: () => true } })
  })

  it('should not render if value isn\'t passed', () => {
    const wrapper = mount(SignUp, {
      localVue,
      vuetify,
      store,
      propsData: { value: false }
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('should not render if value is true', () => {
    const wrapper = mount(SignUp, {
      localVue,
      vuetify,
      store,
      propsData: { value: true }
    })
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.props('value')).toBe(true)
  })
})
