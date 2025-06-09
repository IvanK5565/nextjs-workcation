/* eslint-disable @typescript-eslint/no-unused-vars */
import { IncomingMessage } from "http";

/**
 * Parse url string to readable object
 * @param url string like '/api/login?name=John&email=example@email.com'
 * @returns object like { route:'/api/login', query:{ name:'John', email:'example@email.com' } }
 */
function parseURL(url: string): {route:string, query:Record<string, string>} {
  const query: Record<string, string> = {};
  let route:string;
  if (url.includes('?')) {
    const splitedURL = url.split('?');
    route = splitedURL[0];
    const search = splitedURL[1];
    const params = new URLSearchParams(search);
    params.forEach((value, key) => {
      query[key] = value;
    });
  }
  else {
    route = url;
  }
  return {route,query};
}

/**
* Convert dynamic next-route to RouteMatch.
* @param route A route to convert.
* @returns Converted route.
* @example
*
*     toRouteMatch('/api/users/[id]') === '/api/users/:id' // true
*
*/
function toRouteMatch(route: string): string {
  return route.replace(/\[(\w+)\]/g, ':$1');
}

/**
 * Get body object from request
 * @param req IncomingMessage request
 * @returns parsed body object
 */
async function parseBody(req:IncomingMessage) {
  const body = await new Promise((resolve, reject) => {
    let body = "";
    req.on("error", reject);
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const searchParams = new URLSearchParams(body);
      const result: Record<string, string> = {};
      for (const [key, value] of searchParams) {
        result[key] = value;
      }
      resolve(result);
    });
  });
  return body;
}

// const a = IncomingMessage:{
//   socket: {
//   [Symbol(NextInternalRequestMeta)]: {
//     initURL: 'http://localhost:3000/api/classes/1',
//     initQuery: {},
//     initProtocol: 'http',
//     clonableBody: {
//       finalize: [AsyncFunction: finalize],
//       cloneBodyStream: [Function: cloneBodyStream]
//     },
//     invokePath: '/api/classes/1',
//     invokeQuery: [Object: null prototype] {},
//     middlewareInvoke: false,
//     invokeOutput: '/api/classes/[id]',
//     defaultLocale: undefined,
//     isLocaleDomain: false,
//     bubbleNoFallback: true,
//     match: { definition: [Object], params: [Object] }
//   }
// }