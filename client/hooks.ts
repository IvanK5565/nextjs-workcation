/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntityContainer } from "./entities";
import BaseEntity from "./entities/BaseEntity";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect } from "react";
import DIContext from "./DIContext";
import { useSession } from "next-auth/react";
import Guard from "@/acl/Guard";
import { GRANT, IIdentity, ROLE } from "@/acl/types";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { AppState } from "./store/ReduxStore";
import { IMenu } from "./types";
import get from "lodash/get";
import has from "lodash/has";
import { IPaginationInfo } from "./paginatorExamples/types";

export function useEntity<T extends keyof IEntityContainer>(
  entityName: T
): IEntityContainer[T] {
  const di = useContext(DIContext);
  return di.resolve(entityName);
}
type FirstParam<Type> = Type extends (...args: infer P) => unknown
  ? P[0]
  : undefined;

export function useActions<T extends keyof IEntityContainer>(entityName: T) {
  const dispatch = useDispatch();
  const entity = useEntity(entityName);
  const actions = entity.actions as Omit<
    IEntityContainer[T],
    keyof BaseEntity
  >;

  const dispatches: {
    [key in keyof typeof actions]: (
      data?: FirstParam<IEntityContainer[T][key]>,
    ) => any;
  } = {} as any;

  Object.keys(actions).forEach((action) => {
    dispatches[action as keyof typeof actions] = (data) => dispatch((actions as any)[action](data));
  });

  return dispatches;
}

export function useGuard() {
  const { data: session } = useSession();
  if (session && session.acl) {
    const guard = new Guard(session.acl.roles, session.acl.rules, session.user.role);
    return guard;
  }
  return null;
}
interface IUseAclResult {
  allow: (grant: GRANT, res?: string, role?: ROLE) => boolean;
  isItMe: (userId: string, slug?: string) => boolean;
  identity: IIdentity;
  pathname: string;
  query: ParsedUrlQuery;
}

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

export function useAcl() {
  const { replace, pathname, query } = useRouter();
  let resource = pathname;
  const id = query?.id?.toString();
  if (id) {
    resource = resource.replace("[id]", id);
  }
  const auth = useSelector((state: AppState) => state.auth);

  const hasAccess = (() => {
    if (!auth) return false;
    const { roles, rules, identity } = auth;
    try {

      const guard = new Guard(roles, rules, identity?.role ?? ROLE.GUEST)
      return guard.allow(GRANT.READ, resource);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  })();

  useEffect(() => {
    if (typeof window !== "undefined" && !hasAccess && pathname !== "/403") {
      replace("/403");
    }
  }, [hasAccess, pathname, replace]);

  if (!auth) {
    return {
      allow: () => false,
      isItMe: () => false,
      identity: {},
      pathname,
      query,
    };
  }

  const { roles, rules, identity } = auth;
  try {
    const guard = new Guard(roles, rules, identity?.role ?? ROLE.GUEST)

    const res: IUseAclResult = {
      allow: (grant: GRANT, res?: string, role?: ROLE) => {
        const r = res ? res : resource;
        return guard.allow(grant, r, null, role);
      },
      isItMe: (userId: string) => {
        return identity.id === userId;
      },
      identity,
      pathname,
      query,
    };
    return res;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return {
      allow: () => false,
      isItMe: () => false,
      identity: {},
      pathname,
      query,
    };
  }
};


export function useMenu(menu: IMenu, strict?: boolean): IMenu {
  const { allow } = useAcl();
  return Object.fromEntries(Object.entries(menu).filter(([key, value]) => (value.grant ? allow(value.grant, key) : !strict)))
}

export function usePageItems(pagerName: string, needConcatPages = false):any[] {
  const pager = useSelector<{ pagination: IPaginationInfo }>(state => state.pagination);
  const entityName:any = get(pager, [pagerName, "entityName"]);
  const items = useSelector<any, any>(state => state[entityName]);
  if (!items) return [];

  const pageNumber = get(pager, [pagerName, "currentPage"]);
  if (!needConcatPages) {
    if (has(pager, [pagerName, "pages", pageNumber])) {
      const ids: any[] = get(pager, [pagerName, "pages", pageNumber]);
      return ids
        .map(id => items[String(id)])
        .filter(item => item !== undefined && item !== null);
    }
    return [];
  } else {
    let allItems: any[] = [];
    const pages = get(pager, [pagerName, "pages"]);

    if (pages) {
      for (const i of Object.keys(pages)) {
        const pageIds: any[] = pages[i];
        if (pageIds) {
          allItems = [
            ...allItems,
            ...pageIds.map(id => items[String(id)])
          ];
        }
      }
    }

    return allItems.filter(item => item !== undefined && item !== null
    );
  }
}