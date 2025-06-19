import { useSelector } from "react-redux";
import { entitySelector } from "../store/selectors";
import { Entities } from "../store/types";

// TODO
export function useEntitySelector(name: keyof Entities){
  return useSelector(entitySelector(name));
}