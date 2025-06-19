import { useSelector } from "react-redux"
import { AppState } from "../store/ReduxStore"
import { IPaginationInfo } from "../pagination/types"

// TODO
export type PagerName = any;
export function usePageSelector(name:string){
  return useSelector<AppState, IPaginationInfo>(state => state.pagination[name])
}