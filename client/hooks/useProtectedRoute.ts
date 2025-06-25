import Guard from "@/acl/Guard";
import { ROLE, GRANT } from "@/acl/types";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../store/ReduxStore";

export function useProtectedRoute() {
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
}