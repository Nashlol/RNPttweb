
const INITAL_STATE = {
  account: '',
  password: '',
  error: '',
  loadingEnd: false,
  loginSuccess: false,
  loginFaild: false,
  guestLoginFaild: false,
  loginRepeat: false,
}

export default (state = INITAL_STATE) => {
  return state
}
