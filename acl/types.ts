import { UserRole as ROLE } from '@/constants'
export { UserRole as ROLE } from '@/constants'
// export enum ROLE {
//     GUEST = 'guest',
//     MACHINE = 'machine',
//     USER = 'user',
//     OWNER = 'owner',
//     ROOT = 'root',
// }

// export enum ROLE{
//     GUEST = 'guest',
//     ADMIN = "admin",
//     TEACHER = "teacher",
//     STUDENT = "student",
//   };

export enum GRANT {
    // for business logic
    READ = 'read',
    WRITE = 'write',
    EXECUTE = 'execute',

    // for http requests
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

export enum AuthType {
    GitHub = 'git-hub',
    Default = 'email/password',
}


export interface ISecretRole {
    role: ROLE;
    secret: string;
}

export interface IIdentity  {
    id: any;
    firstName?: string;
    lastName?: string;
    role: ROLE;
    email?: string;
    token?: string;
    secret?: string;
    locale?: string;
    timezone?: string;
    languageCode?: string;
    countryCode?: string;
    authType: AuthType;
}

export interface IRoleData {
    display: string;
    url: string;
    parent?: ROLE[];
    private?: boolean;
}

export interface IRoles {
    [role: string]: IRoleData;
}

export interface IGrants {
    [role: string]: string[];
}

export interface IAllowDeny {
    allow: IGrants;
    deny?: IGrants;
}

export interface IRules {
    [resource: string]: IAllowDeny;
}

export interface IIdentityACL {
    user: IIdentity;
    roles: IRoles;
    rules: IRules;
}

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
