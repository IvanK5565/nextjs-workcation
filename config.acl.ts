if (typeof document !== 'undefined') {
    throw new Error('Do not import `config.js` from inside the client-side code.');
}

import { ROLE, GRANT, IRoles, IRules } from './acl/types';

export const SUPER = [ROLE.ADMIN];

export const roles: IRoles = {
    [ROLE.GUEST]: {
        display: 'guest',
        url: '',
    },

    [ROLE.STUDENT]: {
        display: 'student',
        parent: [ROLE.GUEST],
        url: '/',
    },

    [ROLE.TEACHER]: {
        display: 'teacher',
        parent: [ROLE.STUDENT],
        url: '/',
    },

    [ROLE.ADMIN]: {
        display: 'admin',
        parent: [ROLE.TEACHER],
        url: '/',
        private: true,
    },
};

export const rules: IRules = {
    /*****************************************************************************************
    ************************************* Other Resources ********************************
    ******************************************************************************************/

    // 'socket/*': {
    //     allow: {
    //         [ROLE.USER] : [GRANT.READ],
    //     }
    // },

    'request/*': {
        allow: {
            [ROLE.STUDENT] : [GRANT.READ],
        }
    },

    /*****************************************************************************************
    ************************************* MENU and navigation ********************************
    ******************************************************************************************/

    "NavigationMenu/*/*/*": {
        allow: {
            [ROLE.ADMIN]: [GRANT.READ]
        }
    },

    "NavigationMenu/MyProfile": {
        allow: {
            [ROLE.STUDENT]: [GRANT.READ]
        },
        deny: {
            [ROLE.ADMIN]: [GRANT.READ]
        }
    },

    // 'MainMenu/*/*': {
    //     allow: {
    //         [ROLE.GUEST]: [GRANT.READ],
    //     }
    // },

    /*****************************************************************************************
    ************************************* ROUTES / URLs resources ****************************
    ******************************************************************************************/

    '/': {
        allow: {
            [ROLE.GUEST]: [GRANT.READ, GRANT.GET],
            [ROLE.TEACHER]: [GRANT.WRITE],
            [ROLE.ADMIN]: [GRANT.EXECUTE],
        },
    },

    '/users/new':{
        allow:{
            [ROLE.ADMIN]:[GRANT.READ, GRANT.WRITE, GRANT.EXECUTE]
        }
    },

   

    // '/login': {
    //     allow: {
    //         [ROLE.GUEST]: [GRANT.READ, GRANT.GET],
    //     },
    // },
};
