/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entities } from "../store/types";

export interface TPaginationInfo {
  [key: string]: IPaginationInfo
}

// In-redux entity
export interface IPaginationInfo {
  entityName: keyof Entities;
  pageName: string;
  currentPage: number;
  count: number;
  perPage: number;
  filter?: {
    [key: string]: any;
  };
  sort?: {
    field: string;
    dir: SortDirection;
  };
  pages?: {
    [key: number]: [number];
  };
  touched?: number[];
  fetching?: boolean;
}

// In-controller parameter
export type {IPagerParams} from './IPagerParams'

enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}


export enum Sort{
  none='NONE',
  ASC = 'ASC',
  DESC = 'DESC',
}
