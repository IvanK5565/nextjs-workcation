import Ajv from "ajv";
import IContextContainer from "./IContextContainer";
import addFormats from 'ajv-formats'

export function getAjv(context: IContextContainer){
  const ajv = new Ajv();
  addFormats(ajv);
  return ajv;
}