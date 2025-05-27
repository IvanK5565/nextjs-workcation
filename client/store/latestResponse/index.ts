import { Response } from "@/types";
import {HYDRATE} from 'next-redux-wrapper';


export function latestResponseReducer(res:Response = {success:false, code:500}, action:any):Response{
  if(action.type === HYDRATE)
    return {...(action.payload.latestResponse as Response)};
  if(action.type === 'NEW_RESPONSE')
    return {...(action.payload as Response)};
  return res;
}