import { Response } from "@/types";

export async function xFetch(url:string, method:'GET'|'POST', body?:any){
	const res = await fetch(url, {
		method,
		body,
	}).then((data) => data.json()) as Response;
	if(!res.success){
		//TODO : toast or something
		return res;
	} else {
		// TODO : save data?
		return res;
	}
}

export function xRead(url:string, method:'GET'|'POST' = 'GET'){
	return xFetch(url,method);
}
export function xSave(url:string, body:any, method:'GET'|'POST' = 'POST'){
	return xFetch(url,method, body);
}
export function xDelete(url:string, method:'GET'|'POST' = 'GET'){
	return xFetch(url,method);
}