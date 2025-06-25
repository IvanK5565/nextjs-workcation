import { Entities } from "./types"

type PaginatorsRegistry = {
  [name:string]:{
    entityName: keyof Entities,
    perPage?: number,
  }
}
export const paginators: PaginatorsRegistry = {
  users:{
    entityName:'users',
  }
}

