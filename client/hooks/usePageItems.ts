/* eslint-disable @typescript-eslint/no-explicit-any */
import get from "lodash/get";
import has from "lodash/has";
import { useSelector } from "react-redux";
import { IPaginationInfo } from "../constants";
import { entitySelector } from "../store/selectors";

export function usePageItems(pagerName: string, needConcatPages = false):any[] {
  const pager = useSelector<{ pagination: IPaginationInfo }>(state => state.pagination);
  const entityName:any = get(pager, [pagerName, "entityName"]);
  const items = useSelector(entitySelector(entityName));
  if (!items) return [];

  const pageNumber = get(pager, [pagerName, "currentPage"]);
  if (!needConcatPages) {
    if (has(pager, [pagerName, "pages", pageNumber])) {
      const ids: any[] = get(pager, [pagerName, "pages", pageNumber]);
      return ids
        .map(id => items[String(id)])
        .filter(item => item !== undefined && item !== null);
    }
    return [];
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