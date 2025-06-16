import { GRANT } from "@/acl/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IMenuData {
    icon?: any; //ReactIcon
    label: string;
    component?: any;
    url?: string;
    hide?: boolean;
    resources?: string[];
    items?: IMenu;
    grant?: GRANT;
    data?: any; // save any data within menu item
    route?: string;
    order?: number;
    handler?: any;
}

export interface IMenu {
    [key: string]: IMenuData;
}