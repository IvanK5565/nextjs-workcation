import { GRANT, IIdentity, ROLE } from "@/acl/types";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { useSelector } from "react-redux";
import { AppState } from "../store/ReduxStore";
import { useContainerContext } from "../ContainerContext";

interface IUseAclResult {
  allow: (grant: GRANT, res?: string, role?: ROLE) => boolean;
  isItMe: (userId: string, slug?: string) => boolean;
  identity: IIdentity | null;
  pathname: string;
  query: ParsedUrlQuery;
}

export function useAcl() {
  const { pathname, query } = useRouter();
  const guard = useContainerContext().resolve('guard')
  let resource = pathname;
  const id = query?.id?.toString();
  if (id) {
    resource = resource.replace("[id]", id);
  }
  const auth = useSelector((state: AppState) => state.auth);
  const res: IUseAclResult = {
    allow: () => false,
    isItMe: () => false,
    identity: null,
    pathname,
    query
  }

  // const hasAccess = (() => {
  //   if (!auth) return false;
  //   const { roles, rules, identity } = auth;
  //   try {

  //     const guard = new Guard(roles, rules, identity?.role ?? ROLE.GUEST)
  //     return guard.allow(GRANT.READ, resource);
  //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   } catch (e) {
  //     return false;
  //   }
  // })();

  // useEffect(() => {
  //   if (typeof window !== "undefined" && !hasAccess && pathname !== "/403") {
  //     replace("/403");
  //   }
  // }, [hasAccess, pathname, replace]);

  if (!auth) {
    return res;
  }

  const { /*roles, rules,*/ identity } = auth;
  try {
    // const guard = new Guard(roles, rules, identity?.role ?? ROLE.GUEST)

    res.allow = (grant: GRANT, res?: string, role?: ROLE) => {
      const r = res ? res : resource;
      return guard.allow(grant, r, null, role);
    };
    res.isItMe = (userId: string) => {
      return identity.id === userId;
    };
    res.identity = identity;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    console.error('Guard creating error in useAcl')
  }
  return res;
};


// export function useAcl() {
//   const { replace, pathname, query } = useRouter();
//   const dispatch = useDispatch();
//   // let resource = pathname.replace(/./g,"_")
//   let resource = pathname
//   const id = query?.id?.toString();
//   if (id) {
//     resource = resource.replace("[id]", id);
//   }
//   // TODO: get auth
//   const auth = useSelector((state: AppState) => state.auth);
//   let redirected = false;
//   console.log(auth)
//   if(!auth){
//     console.log("error resource", resource);
//     use(replace("/403"));
//     redirected = true;
//     // dispatch({type:'redirect', payload:'/403' })
//   }

//   const { roles, rules, identity } = auth;
//   const guard = new Guard(roles, rules, identity?.role ?? ROLE.GUEST)
//   if(!redirected && !guard.allow(GRANT.READ, resource) && pathname !== '/403'){
//     console.log("error resource", resource);
//     use(replace("/403"));
//     // dispatch({type:'redirect', payload:'/403' })
//   }

//   const res:IUseAclResult = {
//     allow: (grant: GRANT, res?: string, role?: ROLE) => {
//       const r = res ? res : resource;
//       return guard.allow(grant, r, null, role);
//     },
//     isItMe: (userId: string) => {
//       return identity.id === userId;
//     },
//     identity,
//     pathname,
//     query,
//   };
//   return res;
// };
