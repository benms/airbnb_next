import { createStore, action } from 'easy-peasy'

export default createStore({
  login: {
    loggedIn: false,
    setLoggedIn: action((state) => {
      state.loggedIn = true
    }),
  },
  modals: {
    showModal: false,
    showLoginModal: false,
    showRegistrationModal: false,
    setShowModal: action((state) => {
      // console.log('setShowModal')
      state.showModal = true
    }),
    setHideModal: action((state) => {
      // console.log('setHideModal')
      state.showModal = false
    }),
    setShowLoginModal: action((state) => {
      // console.log('setShowLoginModal')
      state.showModal = true
      state.showLoginModal = true
      state.showRegistrationModal = false
    }),
    setShowRegistrationModal: action((state) => {
      // console.log('setShowRegistrationModal')
      state.showModal = true
      state.showLoginModal = false
      state.showRegistrationModal = true
    })
  }
})