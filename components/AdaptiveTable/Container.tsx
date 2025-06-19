/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import get from "lodash/get";
import has from "lodash/has";
import React, { JSX, useCallback, useEffect, useMemo, useRef } from "react";

import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { PagerName, usePageSelector } from "@/client/hooks/usePageSelector";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import BaseEntity from "@/client/entities/BaseEntity";
import {
  IFieldList,
  IPagerParams,
  PaginationType,
} from "@/client/pagination/IPagerParams";
import { pageSetFilter } from "@/client/store/actions";
import CustomScrollbar from "../CustomScrollbar";
import FilterBar from "./FilterBar";
import LeftRight from "./Paginator/LeftRight";
import TableActions from "./TableActions";
import { withRequestResult } from "./withRequest";

const FILTER_TIMEOUT = 500;

interface IAdaptiveContainer {
  fields?: IFieldList;
  pagerName: PagerName;
  perPage?: number;
  typeOfPagination?: PaginationType;

  onLoadMore: (loadParams: IPagerParams) => void;
  item: (data: any, index: number) => JSX.Element;
  onFilterChanged?: (field: string, value: string) => void;
  getUrlPage?: (i: number) => string;
  emptyListPlaceholder?: string;
  containerClassName?: string;
  placeholderClassName?: string;
  lastElement?: React.ReactNode;
  tableTitle?: string;
  tableTitleClassName?: string;
  tableTitleContainerClassName?: string;
  tableActions?: any;
}

function AdaptiveContainer(props: IAdaptiveContainer) {
  const {
    perPage = 10,
    pagerName,
    fields,
    typeOfPagination,
    item,
    onLoadMore,
    getUrlPage,
    onFilterChanged,
    emptyListPlaceholder,
    containerClassName = "",
    placeholderClassName = "",
    lastElement,
    tableActions,
    tableTitle,
    tableTitleClassName,
    tableTitleContainerClassName,
  } = props;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const pager = usePageSelector(pagerName);
  const entities = useEntitySelector(pager?.entityName);
  const currPage = pager ? get(pager, "currentPage") : null;
  const count = pager ? get(pager, "count") : null;
  const paginationType = typeOfPagination || PaginationType.SHORT;

  const bufItems: any = useMemo(() => {
    if (pager) {
      return BaseEntity.getPagerItems(pagerName, true);
    }
    return [];
  }, [pager, pagerName, entities]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    if (pagerName && !pager?.pages?.[1]) {
      const pFilter: any = has(pager, "filter") ? get(pager, "filter") : {};
      const pSort = has(pager, "sort") ? get(pager, "sort") : {};

      Object.keys(fields).map((field: any) => {
        const fieldValue = fields[field];

        const isFilter = has(fieldValue, "filter");
        const isHaveInitValue = has(fieldValue, "initialValue");

        if (isFilter && isHaveInitValue && !has(pFilter, field)) {
          //@ts-ignore
          pFilter[field] = fieldValue.initialValue;
        }
      });
      dispatch(pageSetFilter(pagerName, pFilter, pSort));
      onLoadMore({
        page: 1,
        pageName: pagerName,
        perPage,
        filter: pFilter,
        sort: pSort as any,
      });
    }
  }, []);

  const handleLoadMore = useCallback(
    (pageNumber: any, direction = "") => {
      if (pager && !get(pager, "fetching")) {
        const pFilter = has(pager, "filter") ? get(pager, "filter") : {};
        const pSort = has(pager, "sort") ? get(pager, "sort") : {};

        onLoadMore({
          page: pageNumber,
          pageName: pagerName,
          filter: pFilter,
          sort: pSort,
          perPage,
        } as IPagerParams);
      }
    },
    [onLoadMore, pager, pagerName, perPage]
  );

  const timerID: any = useRef(null);
  const handleOldFilterEvent = useCallback(
    (name: string, value: any) => {
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
        timerID.current = null;
      }
      timerID.current = setTimeout(() => {
        onFilterChanged(name, value);
      }, FILTER_TIMEOUT);
    },
    [onFilterChanged]
  );

  const handleFilterEvent = useCallback(
    (name: string, value: any) => {
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
        timerID.current = null;
      }

      const pFilter = has(pager, "filter") ? { ...get(pager, "filter") } : {};
      const pSort = has(pager, "sort") ? { ...get(pager, "sort") } : {};

      if (pagerName) {
        if (name === "filterReset") {
          Object.keys(pFilter)
            ?.filter((f) => fields[f]?.filter)
            .map((f) => delete pFilter[f]);
        } else {
          if (value) {
            pFilter[name] = value;
          } else {
            delete pFilter[name];
          }
        }
        dispatch(pageSetFilter(pagerName, { ...pFilter }, { ...pSort }));
      }
      timerID.current = setTimeout(() => {
        onLoadMore({
          page: 1,
          pageName: pagerName,
          filter: pFilter,
          sort: pSort,
          perPage: perPage,
          force: true,
        } as IPagerParams);
      }, FILTER_TIMEOUT);
    },
    [dispatch, fields, onLoadMore, pager, pagerName, perPage]
  );

  const pagination = useMemo(() => {
    switch (paginationType) {
      // case PaginationType.LIGHT:
      //     return (
      //         <LightPaginator
      //             count={count}
      //             perPage={perPage}
      //             currPage={currPage}
      //             getUrlPage={getUrlPage}
      //             onLoadMore={handleLoadMore}
      //         />
      //     );
      // case PaginationType.MEDIUM:
      //     return (
      //         <Paginator
      //             count={count}
      //             perPage={perPage}
      //             currPage={currPage}
      //             getUrlPage={getUrlPage}
      //             onLoadMore={handleLoadMore}
      //         />
      //     );
      case PaginationType.NONE:
      case PaginationType.REF:
        return <></>;
      default:
        return (
          <LeftRight
            count={count}
            perPage={perPage}
            page={currPage}
            onLoadMore={handleLoadMore}
          />
        );
    }
  }, [count, currPage, getUrlPage, handleLoadMore, perPage, paginationType]);

  const setLastItemRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();

      const hasNextPage = currPage < Math.ceil(count / perPage);
      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
              handleLoadMore(currPage + 1);
              observerRef.current?.disconnect();
            }
          },
          { threshold: 0.2 }
        );
        observerRef.current.observe(node);
      }
    },
    [handleLoadMore, currPage]
  );

  const tableBlock = useMemo(() => {
    if (bufItems && bufItems.length) {
      return (
        <>
          {bufItems.map((data: any, i: number) => {
            let flooredValue = Math.floor(perPage * 0.1);
            flooredValue = flooredValue < 1 ? 1 : flooredValue;
            return (
              item && (
                <div
                  key={i}
                  ref={
                    i === bufItems?.length - flooredValue
                      ? setLastItemRef
                      : null
                  }
                >
                  {item(data, i)}
                </div>
              )
            );
          })}
          {lastElement}
        </>
      );
    } else {
      return (
        lastElement || (
          <p
            className={`urbanist-14-semibold w-full !text-[1rem] text-gray2 py-5 text-center ${placeholderClassName}`}
          >
            {typeof emptyListPlaceholder === "string"
              ? t(emptyListPlaceholder)
              : emptyListPlaceholder}
          </p>
        )
      );
    }
  }, [pager, bufItems, placeholderClassName]);

  const WrappedBlock = withRequestResult(
    () => (
      <div ref={containerRef} className={`${containerClassName}`}>
        {tableBlock}
      </div>
    ),
    { pager }
  ) as any;

  return (
    <div className={"flex flex-col relative"}>
      {(!!tableTitle || !!Object.keys(fields)?.length || !!tableActions) && (
        <div
          className={`w-full flex gap-1 mb-3 items-start lg:items-center lg:gap-5 lg:mb-[2.188rem] ${tableTitleContainerClassName}`}
        >
          <h2
            className={`font-bold pl-12 text-[1.5rem] leading-8  text-black text-nowrap lg:pl-0 ${tableTitleClassName}`}
          >
            {tableTitle}
          </h2>
          <div className="w-full flex items-center justify-end">
            <FilterBar
              pager={pager}
              fields={fields}
              onFilterChanged={
                onFilterChanged ? handleOldFilterEvent : handleFilterEvent
              }
            />
          </div>
          {tableActions && <TableActions tableActions={tableActions} />}
        </div>
      )}
      {pager && count > 1 && <div className="">{pagination}</div>}

      <WrappedBlock />

      {pager && count > 1 && <div className="">{pagination}</div>}
      {paginationType === PaginationType.REF && (
        <CustomScrollbar
          activeStyle="bg-[#DCD0D0]"
          defaultStyle="bg-[#737379]"
          containerRef={containerRef}
        />
      )}
    </div>
  );
}
export default AdaptiveContainer;
