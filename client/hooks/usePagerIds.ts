import get from "lodash/get";
import has from "lodash/has";
import { useSelector } from "react-redux";
import { IPaginationInfo } from "../constants";

export function usePagerIds(pagerName: string, needConcatPages = false) {
  const pager = useSelector<{ pagination: IPaginationInfo }>(state => state.pagination);

  const pageNumber = get(pager, [pagerName, "currentPage"]);
  if (!needConcatPages) {
    if (has(pager, [pagerName, "pages", pageNumber])) {
      const ids: number[] = get(pager, [pagerName, "pages", pageNumber]) ?? [];
      return ids
    }
    return [];
  } else {
    let allItems: number[] = [];
    const pages = get(pager, [pagerName, "pages"]);

    if (pages) {
      for (const i of Object.keys(pages)) {
        const pageIds: number[] = pages[i];
        if (pageIds) {
          allItems = [
            ...allItems,
            ...pageIds
          ];
        }
      }
    }

    return allItems.filter(item => item !== undefined && item !== null
    );
  }
}