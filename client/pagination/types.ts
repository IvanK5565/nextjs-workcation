/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISortParams } from "./IPagerParams";

export interface TPaginationInfo {
  [key: string]: IPaginationInfo
}

// In-redux entity
export interface IPaginationInfo {
  entityName: string;
  pageName: string;
  currentPage: number;
  count: number;
  perPage: number;
  filter?: {
    [key: string]: any;
  };
  sort?: ISortParams;
  pages?: {
    [key: number]: [number];
  };
  touched?: number[];
  fetching?: boolean;
}

// In-controller parameter
export type {IPagerParams} from './IPagerParams'
