/* eslint-disable @typescript-eslint/no-explicit-any */
import { call, Effect, put, select } from "redux-saga/effects";
import { IPagerParams, TPaginationInfo } from "./types";
import { AppState } from "../store/ReduxStore";
import BaseEntity from "../entities/BaseEntity";
import { get, has } from "lodash";
import clientContainer from "../di/container";

const actionTypes = {} as any;

export abstract class BaseEntity2 extends BaseEntity {

  public *pageEntity(uri: string, params: IPagerParams): Generator<Effect> {
    const pageName = params.pageName ?? '';
    const pagination: TPaginationInfo = yield select(
      (state: AppState & { pagination: TPaginationInfo }) => state.pagination ?? {},
    );
    if (!('page' in params)) {
      params['page'] = pagination[pageName]['currentPage'];
    }
    let count = 0;
    if (
      !params.force &&
      pagination[pageName] &&
      pagination[pageName]['count']
    ) {
      count = pagination[pageName]['count'];
    }

    // set filter to paginator, in case fetch from getInitProps()
    const pFilter = params.filter ? params.filter : {};
    const pSort = params.sort ? params.sort : {};
    yield put(actionTypes.pageSetFilter(pageName, pFilter, pSort));

    const pagerData = {
      ...params,
      pageName,
      count,
      entityName: this.name,
    };

    const isPageNotExist =
      !pagination?.[pageName] ||
      !pagination?.[pageName]?.['pages']?.[params?.page ?? 0];
    if (isPageNotExist || params?.force) {
      const res = yield call(
        this.xRead,
        uri,
        'POST',
        pagerData,
        params.force || isPageNotExist,
      );

      return res;
    } else if (
      pagination?.[pageName] &&
      pagination?.[pageName]?.pages &&
      pagination?.[pageName]?.pages?.[params?.page || 0] &&
      pagination?.[pageName]?.currentPage !== params?.page
    ) {
      yield put(
        actionTypes.setPagerParams(pageName, {
          ...params,
          currentPage: params.page,
        }),
      );
    }
  }

  public static getPagerItems(
    pagerName: string,
    needConcatPages = false
  ): any[] {
    const { state } = clientContainer.resolve("redux") as any;
    const pager = state["pagination"];
    if (has(pager, pagerName)) {
      const entityName = get(pager, [pagerName, "entityName"]);
      if (has(state, ["entities", entityName])) {
        const pageNumber = get(pager, [pagerName, "currentPage"]);
        const items = state["entities"][entityName];
        if (!needConcatPages) {
          if (get(pager, [pagerName, "pages", pageNumber])) {
            const ids: any[] = get(pager, [pagerName, "pages", pageNumber]);
            return ids
              .map(id => items[String(id)])
              .filter(item => item !== undefined && item !== null);
          }
        } else {
          let allItems: any[] = [];
          const pages = get(pager, [pagerName, "pages"]);

          if (pages) {
            for (const i of Object.keys(pages)) {
              const pageIds: any[] = pages[i];
              if (pageIds) {
                allItems = [
                  ...allItems,
                  ...pageIds.map(id => items[String(id)])
                ];
              }
            }
          }

          return allItems.filter(item => item !== undefined && item !== null
          );
        }
      }
    }
    return [];
  }
}