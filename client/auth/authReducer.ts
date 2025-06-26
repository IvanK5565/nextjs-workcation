import { IIdentity, IRoles, IRules } from "@/acl/types";
import { HYDRATE } from "next-redux-wrapper";
import { AUTH_SIGN_OUT, SET_AUTH } from "../store/actionTypes";
import { IClientContainer } from "../di/container";

export type AuthState = {
  roles: IRoles,
  rules: IRules,
  identity: IIdentity
}
export type AuthAction = {
  type: string,
  auth?: AuthState,
  payload?: { auth: AuthState }
}

export const authReducerContainer = (di: IClientContainer) =>
  (auth: null | AuthState = null, action: AuthAction) => {
    const setAuth = (auth: AuthState) => {
      di.guard.update(
        auth.roles,
        auth.rules,
        auth.identity.role
      )
      return { ...auth };
    }
    switch (action.type) {
      case HYDRATE: {
        if (action.payload) return setAuth(action.payload.auth);
      }
      case SET_AUTH: {
        if (action.auth) return setAuth(action.auth);
      }
      case AUTH_SIGN_OUT: return null;
      default: return auth;
    }
  }

const authReducer = (auth: null | AuthState = null, action: AuthAction) => {
  switch (action.type) {
    case HYDRATE: if (action.payload) return { ...action.payload.auth };
    case SET_AUTH: if (action.auth) return { ...action.auth };
    case AUTH_SIGN_OUT: return null;
    default: return auth;
  }
}


export default authReducer;