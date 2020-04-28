import {
  HIDE_MESSAGE,
  INIT_URL,
  ON_HIDE_LOADER,
  ON_SHOW_LOADER,
  SHOW_MESSAGE,
  SIGNIN_CLIENT_SUCCESS,
  SIGNUP_CLIENT_SUCCESS
} from "constants/ActionTypes";

const INIT_STATE = {
  loader: false,
  alertMessage: '',
  showMessage: false,
  initURL: '',
  authClient: localStorage.getItem('client_id'),
};


export default (state = INIT_STATE, action) => {
  switch (action.type) {
    case SIGNUP_CLIENT_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload
      }
    }
    case SIGNIN_CLIENT_SUCCESS: {
      return {
        ...state,
        loader: false,
        authUser: action.payload
      }
    }
    case INIT_URL: {
      return {
        ...state,
        initURL: action.payload
      }
    }
    case SHOW_MESSAGE: {
      return {
        ...state,
        alertMessage: action.payload,
        showMessage: true,
        loader: false
      }
    }
    case HIDE_MESSAGE: {
      return {
        ...state,
        alertMessage: '',
        showMessage: false,
        loader: false
      }
    }
    case ON_SHOW_LOADER: {
      return {
        ...state,
        loader: true
      }
    }
    case ON_HIDE_LOADER: {
      return {
        ...state,
        loader: false
      }
    }
    default:
      return state;
  }
}
