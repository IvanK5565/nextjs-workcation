// export function parseURL(url: string): {route:string, query:Record<string, string>} {
//   const query: Record<string, string> = {};
//   let route:string;
//   if (url.includes('?')) {
//     let splitedURL = url.split('?');
//     route = splitedURL[0];
//     const search = splitedURL[1];
//     const params = new URLSearchParams(search);
//     params.forEach((value, key) => {
//       query[key] = value;
//     });
//   }
//   else {
//     route = url;
//   }
//   return {route,query};
// }