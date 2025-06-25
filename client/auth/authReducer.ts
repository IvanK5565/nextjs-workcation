import { IIdentity, IRoles, IRules } from "@/acl/types";
import { HYDRATE } from "next-redux-wrapper";
import { AUTH_SIGN_OUT, SET_AUTH } from "../store/actionTypes";

export type AuthState = null | {
  roles: IRoles,
  rules: IRules,
  identity: IIdentity
}
export type AuthAction = {
  type: string,
  auth?: AuthState,
  payload?: {auth:AuthState}
}

const authReducer = (auth: AuthState = null, action: AuthAction) => {
  switch (action.type) {
    case HYDRATE: if(action.payload) return {...action.payload.auth};
    case SET_AUTH: if(action.auth) return {...action.auth};
    case AUTH_SIGN_OUT: return null;
    default: return auth;
  }
}

export default authReducer;