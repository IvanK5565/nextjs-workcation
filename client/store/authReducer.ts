import { IIdentity, IRoles, IRules } from "@/acl/types";
import { HYDRATE } from "next-redux-wrapper";

type AuthState = {
  roles: IRoles,
  rules: IRules,
  identity: IIdentity
}
type AuthAction = {
  type: string,
  payload?: { auth?: AuthState }
}

const authReducer = (auth: AuthState = { roles: {}, rules: {}, identity: {} as IIdentity }, action: AuthAction) => {
  if(!action.payload || !action.payload.auth){
    return auth;
  }
  switch (action.type) {
    case HYDRATE:
    case 'setAuth': return action.payload.auth;
    default: return auth;
  }
}

export default authReducer;