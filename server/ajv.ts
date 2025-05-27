import Ajv from "ajv";
import IContextContainer from "@/server/container/IContextContainer";
import addFormats from 'ajv-formats'

export function getAjv(context: IContextContainer){
  const ajv = new Ajv({ coerceTypes: true });
  addFormats(ajv);
  return ajv;
}