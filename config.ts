import merge from "lodash/merge";

if (typeof document !== 'undefined') {
    throw new Error('Do not import config.js from inside the client-side code. !!!!!!');
}

const isDev = process.env.ENVIRONMENT !== 'prod';



const prodConfig = {
    dev: isDev,
    baseUrl: process.env.BASE_URL,
    apiUrl:  process.env.API_STRING,

}

let localConfig = {};

if (isDev) {
    try {
        localConfig = require("./config.local.ts");
    } catch (ex) {
        console.log("ex", ex);
        console.log("config.local does not exist.");
    }
}

export default merge(prodConfig, localConfig ?? {});