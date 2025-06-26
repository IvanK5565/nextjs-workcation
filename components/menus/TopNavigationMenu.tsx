import { GRANT } from "@/acl/types";
import { IMenu } from "../../client/types";

export const TopNavigationMenu: IMenu = {
    "NavigationMenu/Users": {
        grant: GRANT.READ,
        label: "users",
        resources: [""],
        url: "/home/users",
    },
    "NavigationMenu/Categories": {
        grant: GRANT.READ,
        label: "categories",
        resources: [""],
        url: "/home/categories",
    },
    "NavigationMenu/Recipes": {
        grant: GRANT.READ,
        label: "recipes",
        resources: ["*"],
        url: "/home/recipes",
    },

}
