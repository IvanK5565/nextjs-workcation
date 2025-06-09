if (typeof document !== "undefined") {
    throw new Error(
        "Do not import `acl/cleaner` from inside the client-side code."
    );
}

// Requires set-value@^2.0.1 !!!
import set from "set-value";

import { IRoles, ROLE, IRules } from "./types";
import Acl from "./Acl";
import BaseContext from "@/server/container/BaseContext";

export class Cleaner extends BaseContext{
    public guestRolesAndRules(){
        const acl = new Acl(this.di.roles, this.di.rules);
        return this.cleanRolesAndRules(acl, ROLE.GUEST);
    }
    public cleanRolesAndRules(acl:Acl, role:ROLE){
        return {
            roles:this.cleanRoles(acl,role),
            rules:this.cleanRules(acl,role),
        }
    }
    public cleanRoles(acl:Acl, role: ROLE): IRoles {
        const { roles } = this.di;
        return Cleaner.cleanRoles(acl, roles, role);
    }
    public cleanRules(acl:Acl, role: ROLE): IRules {
        const { rules } = this.di;
        return Cleaner.cleanRules(acl, rules, role);
    }
    public static cleanRoles(acl:Acl, roles:IRoles, role:ROLE){
        const result: IRoles = {};
        for (const item in roles) {
            if (roles.hasOwnProperty(item)) {
                if (role === item || acl.inheritsRole(role, item)) {
                    result[item] = roles[item];
                }
            }
        }
        return result;
    }
    public static cleanRules(acl:Acl, rules:IRules, role:ROLE){
        const result: IRules = {};
        for (const resource in rules) {
            if (rules.hasOwnProperty(resource)) {
                const grant = rules[resource];
                if (grant.hasOwnProperty("allow")) {
                    for (const r in grant.allow) {
                        if (grant.allow.hasOwnProperty(r)) {
                            if (role === r || acl.inheritsRole(role, r)) {
                                set(
                                    result,
                                    `${resource}.allow.${r}`,
                                    grant.allow[r]
                                );
                            }
                        }
                    }
                }
                if (grant.hasOwnProperty("deny")) {
                    for (const r in grant.deny) {
                        if (grant.deny.hasOwnProperty(r)) {
                            if (role === r || acl.inheritsRole(role, r)) {
                                set(result, `${resource}.deny.${r}`, grant.deny[r]);
                            }
                        }
                    }
                }
            }
        }
        return result;
    }
}

// export function cleanRoles(guard: Guard, role: ROLE): IRoles {
//     const result: IRoles = {};
//     const roles = guard.roles;
//     const acl: Acl = guard.acl;
//     for (const item in roles) {
//         if (roles.hasOwnProperty(item)) {
//             if (role === item || acl.inheritsRole(role, item)) {
//                 result[item] = roles[item];
//             }
//         }
//     }
//     return result;
// }

// export function cleanRules(guard: Guard, role: ROLE): IRules {
//     const result: IRules = {};
//     const rules = guard.rules;
//     const acl: Acl = guard.acl;
//     for (const resource in rules) {
//         if (rules.hasOwnProperty(resource)) {
//             const grant = rules[resource];
//             if (grant.hasOwnProperty("allow")) {
//                 for (const r in grant.allow) {
//                     if (grant.allow.hasOwnProperty(r)) {
//                         if (role === r || acl.inheritsRole(role, r)) {
//                             set(
//                                 result,
//                                 `${resource}.allow.${r}`,
//                                 grant.allow[r]
//                             );
//                         }
//                     }
//                 }
//             }
//             if (grant.hasOwnProperty("deny")) {
//                 for (const r in grant.deny) {
//                     if (grant.deny.hasOwnProperty(r)) {
//                         if (role === r || acl.inheritsRole(role, r)) {
//                             set(result, `${resource}.deny.${r}`, grant.deny[r]);
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     return result;
// }
