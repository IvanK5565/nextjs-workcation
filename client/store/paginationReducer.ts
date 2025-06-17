/* eslint-disable @typescript-eslint/no-explicit-any */
// --------------------------------- reducer.ts ---------------------

import { TPaginationInfo } from "../paginatorExamples/types";

export const PAGE_FETCHING = 'PAGE_FETCHING'
export const PAGE_SET_FILTER = 'PAGE_SET_FILTER'
export const PAGE_SELECT_ITEM = 'PAGE_SELECT_ITEM'
export const PAGE_CLEAR = 'PAGE_CLEAR'
export const PAGE_CLEAR_ALL = 'PAGE_CLEAR_ALL'
export const PAGE_SET_PARAMS = 'PAGE_SET_PARAMS'

const initialPagerState:TPaginationInfo = {
  users:{
    count:0,
    currentPage:0,
    pages:{},
  }
}

export default function paginationReducer(state = initialPagerState, action: any) {
		switch (action.type) {
			case 'DELETE_ALL': return Object.fromEntries(Object.entries(state).map(([key,p]) => [key,{...p, pages:undefined}]));
		}
  // get result for the paginator, disable fetching
  if (action?.payload?.data && action.payload.pager) {
    const pager = action.payload.pager;
    const result = action.payload.data?.result ?? [];
    if (pager.pageName) {
      const paginatorName = pager.pageName;
 
      const pagination = state[paginatorName] ?? {};
      const pages = pagination["pages"] ?? {};
      let item: any | null = null;
 
      if (result?.length === 0) {
        pager.page = pages?.size ?? 1;
      } else {
        item = result;
      }
 
      return {
        ...state,
        [paginatorName]: {
          ...state[paginatorName],
          ...pagination,
          entityName: pager.entityName,
          pageName: paginatorName,
          currentPage: pager.page,
          count: pager.count,
          perPage: pager.perPage,
          filter: pager.filter ?? pagination?.filter ?? {},
          pages:
            pager?.page === 1
              ? {
                  [pager.page]: item,
                }
              : {
                  ...pages,
                  [pager.page]: item,
                },
          touched: pagination?.touched ?? [],
        },
      };
    }
  }
  // prepare item for the paginator, enable fetching
  const { type } = action;
  switch (type) {
    case PAGE_FETCHING: {
      const { pageName, page, isFetching } = action;
      const pagination = state[pageName] ?? {};
      let currentPage = pagination["currentPage"];
 
      if (pagination["pages"] && pagination["pages"][page]) {
        //to avoid empty page before loading new page data
 
        currentPage = page;
      }
      const newState = {
        ...state,
        [pageName]: {
          ...state[pageName],
          ...pagination,
          currentPage,
          fetching: isFetching,
        },
      };
      return newState;
    }
    case PAGE_SET_FILTER: {
      const { pageName, filter, sort } = action;
      const pagination = state[pageName] ? state[pageName] : {};
      const newState = {
        ...state,
        [pageName]: {
          ...state[pageName],
          ...pagination,
          filter: filter,
          sort: sort,
        },
      };
      return newState;
    }
 
    case PAGE_SELECT_ITEM:
      {
        const { pageName, selectedItems } = action;
        const pagination = state[pageName] ? { ...state[pageName] } : {};
        pagination["touched"] = selectedItems;
        const newState = {
          ...state,
          [pageName]: {
            ...state[pageName],
            ...pagination,
          },
        };
        return newState;
      }
 
    case PAGE_CLEAR: {
      const { pageName } = action;
      // const newState = {
      //   ...state,
      //   [pageName]: {
      //     ...state[pageName],
      //     pages: state[pageName]?.["pages"]?.["1"]?.length
      //       ? { ["1"]: state[pageName]?.["pages"]?.["1"] }
      //       : {},
      //   },
      // };
      const newState = {
        ...state,
        [pageName]: {
          ...state[pageName],
          pages:  {},
        },
      };
      return newState;
    }
 
    case PAGE_CLEAR_ALL: {
      const newState = {};
      return newState;
    }
    case PAGE_SET_PARAMS: {
      const { pageName, params } = action;
 
      return {
        ...state,
        [pageName]: {
          ...state[pageName],
          ...params,
          pages: state[pageName]?.pages ?? {},
          count: state[pageName]?.count ?? 0,
        },
      };
    }
  }
 
  return state;
}