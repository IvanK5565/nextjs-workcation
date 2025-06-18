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
export interface IPagerParams {
  pageName?: string; // paginator name
  // sort?: object;      // object with sorting key/values
  sort?: ISortParams;
  filter?: object; //object;    // object with filtering key/values
  page?: number; // page number
  perPage: number; // count items on one page
  force?: boolean; // reload data in the redux and pager
  count?: number; // count by filter, if 0 need to recalculate, if > 0 count doesn't need to calculate
  entityName?: string;
}

enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

interface ISortParams {
  field: string;
  sort: Sort;
};

export enum Sort{
  none='NONE',
  ASC = 'ASC',
  DESC = 'DESC',
}
