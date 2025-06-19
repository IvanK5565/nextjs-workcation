/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import get from "lodash/get";
import has from "lodash/has";
import union from "lodash/union";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { IMenu } from "@/acl/types";
import { useEntitySelector } from "@/client/hooks/useEntitySelector";
import { PagerName, usePageSelector } from "@/client/hooks/usePageSelector";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import BaseEntity from "@/client/entities/BaseEntity";
import {
  Actions,
  FilterType,
  IFieldList,
  IPagerParams,
  PaginationType,
  Sort,
} from "@/client/pagination/IPagerParams";
import { isFunction } from "@/client/utils/random";
import { pageSelectItem } from "@/client/store/actions";
import InsetSpinner from "../InsetSpinner";
import { CheckType } from "../SpinnerBase";
import ExternalSort from "./ExternalSort";
import FilterBar from "./FilterBar";
import HeadItem from "./HeadItem";
import MultiSelectActions from "./MultiSelect/index";
import LeftRight from "./Paginator/LeftRight";
import LightPaginator from "./Paginator/LightPaginator";
import LoadMorePaginator from "./Paginator/LoadMorePaginator";
import Row from "./Row";
import { ISortOptions } from "./SortBy";
import TableActions from "./TableActions";
import { withRequestResult } from "./withRequest";
import { usePageItems } from "@/client/hooks/usePageItems";

const FILTER_TIMEOUT = 500;

interface IAdaptiveTable {
  fields: IFieldList;
  pagerName: PagerName;
  onLoadMore: (loadParams: IPagerParams) => void;
  perPage: number;

  // optional parameters
  className?: string;
  rowClassName?: string;
  bodyClassName?: string;
  actions?: Actions[];
  tableActions?: IMenu;
  multiSelectActions?: IMenu;
  noHeader?: boolean;
  isShadow?: boolean;
  isOverflow?: boolean;
  typeOfPagination?: PaginationType;
  colors?: string[];
  actionClassName?: string;
  actionMenu?: IMenu;
  onFilterChanged?: (field: string, value: string) => void;
  pageSetFilter?: (pageName: string, filter: object, sort: object) => void;
  loaderEntities?: CheckType | CheckType[];

  emptyListPlaceholder?: string | JSX.Element;

  drawSubRow?: (data: any) => JSX.Element;
  onActionClick?: (
    action: Actions,
    data: any,
    pagerParams: IPagerParams
  ) => void;
  actionIsDisabled?: (action: Actions, data: any) => boolean;

  onTdClick?: (field: string, data: any) => void;
  onRowClick?: (data: any) => void;

  onItemChange?: (id: string, value: any, field: string) => void;
  tableClassName?: string;
  tableTitle?: string;
  isMultiSelect?: boolean;
  tableTitleClassName?: string;
  tableTitleContainerClassName?: string;
  actionContainerClassName?: string;
  actionHeadClassName?: string;
  placeholderClassName?: string;
  isExternalSort?: boolean;
}

function AdaptiveTable(props: IAdaptiveTable) {
  const {
    actions,
    isShadow,
    isOverflow,
    noHeader,
    perPage,
    pagerName,
    typeOfPagination,
    colors,
    className,
    rowClassName,
    bodyClassName,
    actionClassName,
    actionMenu,
    onRowClick,
    onTdClick,
    onItemChange,
    onActionClick,
    onLoadMore,
    onFilterChanged,
    actionIsDisabled,
    drawSubRow,
    loaderEntities,
    tableClassName,
    tableTitle,
    tableActions,
    multiSelectActions,
    isMultiSelect,
    emptyListPlaceholder = "no-entries-yet",
    tableTitleClassName = "",
    tableTitleContainerClassName = "",
    actionContainerClassName = "",
    actionHeadClassName = "",
    placeholderClassName = "",
    isExternalSort = false,
  } = props;

  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pager = usePageSelector(pagerName);
  const entities = useEntitySelector(pager?.entityName);
  const dispatch = useDispatch();
  const paginationType = typeOfPagination || PaginationType.SHORT;
  const currPage = pager ? get(pager, "currentPage") : null;
  const count = pager ? get(pager, "count") : null;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  const isInfinityContainer = typeOfPagination === PaginationType.NONE;
  const isLoadMoreContainer = typeOfPagination === PaginationType.LOAD_MORE;
  
  const bufItems = usePageItems(pagerName,isInfinityContainer || isLoadMoreContainer);
  const bufItems2: any = useMemo(() => {
    if (pager) {
      return BaseEntity.getPagerItems(
        pagerName,
        isInfinityContainer || isLoadMoreContainer
      );
    }
    return [];
  }, [pager, pagerName, entities, typeOfPagination]);

  const fields = useMemo(() => {
    let fields = props.fields;
    if (isMultiSelect) {
      fields = Object.assign(
        {
          ["toucher"]: {
            type: FilterType.Touche,
            column: {
              editable: true,
            },
          },
        },
        fields
      );
    }
    return fields;
  }, [props.fields, isMultiSelect]);

  useEffect(() => {
    if (pagerName && !pager?.pages?.[1]) {
      const pFilter = has(pager, "filter") ? get(pager, "filter") : {};
      const pSort = has(pager, "sort") ? get(pager, "sort") : {};

      Object.keys(fields).map((field: any) => {
        const fieldValue = fields[field];

        const isFilter = has(fieldValue, "filter");
        const isHaveInitValue = has(fieldValue, "initialValue");
        const isExistInSearch = searchParams.has(field);
        if (isFilter && isHaveInitValue && !has(pFilter, field)) {
          //@ts-ignore
          pFilter[field] = fieldValue.initialValue;
        } else if (isFilter && isExistInSearch) {
          pFilter[field] = searchParams.get(field);
        }
      });
      // dispatch(pageSetFilter(pagerName, pFilter, pSort));
      if (onLoadMore && typeof onLoadMore === "function") {
        onLoadMore?.({
          page: currPage ?? 1,
          pageName: pagerName,
          perPage,
          filter: pFilter,
          sort: pSort as any,
        });
      }
    }
  }, []);

  const handleLoadMore = useCallback(
    (pageNumber: any) => {
      if (pager && !get(pager, "fetching")) {
        const pFilter = has(pager, "filter") ? get(pager, "filter") : {};
        const pSort = has(pager, "sort") ? get(pager, "sort") : {};
        if (onLoadMore && typeof onLoadMore === "function") {
          onLoadMore?.({
            page: pageNumber,
            pageName: pagerName,
            filter: pFilter,
            sort: pSort,
            perPage,
          } as IPagerParams);
        }
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
        // dispatch(pageSetFilter(pagerName, { ...pFilter },  { ...pSort }));
      }

      timerID.current = setTimeout(() => {
        if (onLoadMore && typeof onLoadMore === "function") {
          onLoadMore?.({
            page: 1,
            pageName: pagerName,
            filter: pFilter,
            sort: pSort,
            perPage: perPage,
            force: true,
          } as IPagerParams);
        }
      }, FILTER_TIMEOUT);
    },
    [dispatch, fields, onLoadMore, pager, pagerName, perPage]
  );

  const handleSortEvent = useCallback(
    (field: string, sort: Sort) => {
      const pFilter = has(pager, "filter") ? get(pager, "filter") : {};
      const pSort = { field, sort };
      // dispatch(pageSetFilter(props.pagerName, pFilter, pSort));
      if (timerID.current !== null) {
        clearTimeout(timerID.current);
        timerID.current = null;
      }
      timerID.current = setTimeout(() => {
        onLoadMore?.({
          page: 1,
          pageName: pagerName,
          filter: pFilter,
          sort: pSort,
          perPage: perPage,
          force: true,
        } as IPagerParams);
      }, FILTER_TIMEOUT);
    },
    [dispatch, onLoadMore, pager, pagerName, perPage, props.pagerName]
  );

  const isShadowStyle = isShadow ? "shadow-xl rounded-lg" : "";
  const isOverflowStyle = isOverflow
    ? "overflow-auto md:overflow-visible"
    : "overflow-auto";

  const [touched, setTouched] = useState<string[]>([]);

  useEffect(() => {
    if (pager) {
      setTouched(get(pager, "touched"));
    }
  }, [pager]);

  const isTouchedAll = useMemo(() => {
    let pageIDS = [];
    if (isInfinityContainer) {
      pageIDS = bufItems;
    } else {
      pageIDS = get(pager, ["pages", get(pager, "currentPage")]);
    }
    if(!pageIDS || pageIDS.length === 0) return false;
    return pageIDS?.every((id) =>
      typeof id === "string"
        ? touched?.includes?.(id)
        : touched?.includes?.(id?.id)
    );
  }, [pager, bufItems]);

  const handleOnItemChange = useCallback(
    (id: string, value: any, field: string) => {
      if ("function" === typeof onItemChange) {
        onItemChange(id, value, field);
      }
    },
    [onItemChange]
  );

  const onSelectRowHandler = useCallback(
    (selectedIds: string[] | string | { id: string }[], needAdd: boolean) => {
      let selected = [];
      if (Array.isArray(selectedIds)) {
        const selectedIdsUpdated = selectedIds.map((item) =>
          typeof item === "object" && "id" in item ? item.id : item
        );
        if (needAdd) {
          selected = union(selectedIdsUpdated, touched);
        } else {
          selected = touched?.filter(
            (touch) => !selectedIdsUpdated.includes(touch)
          );
        }
      } else {
        const index = touched.indexOf(selectedIds);
        if (index !== -1) {
          selected = [...touched.slice(0, index), ...touched.slice(index + 1)];
        } else {
          selected = [...touched, selectedIds];
        }
      }
      dispatch(pageSelectItem(get(pager, "pageName"), selected));
      setTouched(selected);
    },
    [dispatch, pager, isMultiSelect]
  );

  const onSelectOneRow = useMemo(() => {
    return isMultiSelect
      ? (id: string) => onSelectRowHandler(id, isTouchedAll)
      : null;
  }, [isTouchedAll, onSelectRowHandler, isMultiSelect]);

  const onSelectAllRows = useCallback(() => {
    if (isInfinityContainer) {
      onSelectRowHandler(bufItems, !isTouchedAll);
    } else {
      const newLocal = "currentPage";
      onSelectRowHandler(
        get(pager, ["pages", String(get(pager, newLocal))]),
        !isTouchedAll
      );
    }
  }, [isTouchedAll, onSelectRowHandler, bufItems, pager]);

  useEffect(() => {
    if (!lastItemRef.current || !pager || !isInfinityContainer) return;

    const hasNextPage = currPage < Math.ceil(count / perPage);
    if (!hasNextPage) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore(currPage + 1);
          observerRef.current?.disconnect();
        }
      },
      {
        root: null,
        threshold: 1,
      }
    );

    observerRef.current.observe(lastItemRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [handleLoadMore, bufItems, currPage, count, perPage]);

  const pagination = useMemo(() => {
    switch (paginationType) {
      case PaginationType.LIGHT:
        return (
          <LightPaginator
            count={count}
            perPage={perPage}
            currPage={currPage}
            onLoadMore={handleLoadMore}
          />
        );
      case PaginationType.LOAD_MORE:
        return (
          <LoadMorePaginator
            count={count}
            perPage={perPage}
            currPage={currPage}
            onLoadMore={handleLoadMore}
          />
        );
      case PaginationType.NONE:
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
  }, [count, currPage, handleLoadMore, perPage, paginationType]);

  const sort = useMemo(() => {
    // only paginators have sort and filter properties in redux
    const pagerSort = pager && get(pager, "sort");
    if (pagerSort) {
      return {
        field: get(pagerSort, "field"),
        sort: get(pagerSort, "sort"),
      };
    } else {
      return { field: "", sort: Sort.none };
    }
  }, [pager]);

  const tableRows = useMemo(() => {
    if (bufItems && bufItems.length) {
      return bufItems.map((item: any, i: number) => {
        let flooredValue = Math.floor(perPage * 0.1);
        flooredValue = flooredValue < 1 ? 1 : flooredValue;
        return (
          item && (
            <Row
              ref={i === bufItems?.length - flooredValue ? lastItemRef : null}
              key={`AdaptiveTable_Row_${i}`}
              data={item}
              pager={pager}
              columns={fields}
              actions={actions}
              rowClassName={rowClassName}
              actionClassName={actionClassName}
              actionMenu={actionMenu}
              onSelectOneRow={onSelectOneRow}
              drawSubRow={drawSubRow}
              actionContainerClassName={actionContainerClassName}
              subRowBackground={colors ? colors[i] : false}
              onActionClick={onActionClick}
              actionIsDisabled={actionIsDisabled}
              onRowClick={onRowClick}
              onTdClick={onTdClick}
              onItemChange={handleOnItemChange}
              isMultiSelect={multiSelectActions ? true : false}
            />
          )
        );
      });
    } else {
      return (
        <tr>
          <td
            colSpan={
              fields &&
              Object.keys(fields).filter((k) => "column" in fields[k]).length
            }
          >
            <p
              className={`urbanist-14-semibold text-gray2 py-5 text-center ${placeholderClassName}`}
            >
              {typeof emptyListPlaceholder === "string"
                ? t(emptyListPlaceholder)
                : emptyListPlaceholder}
            </p>
          </td>
        </tr>
      );
    }
  }, [
    actionClassName,
    actionMenu,
    actions,
    fields,
    drawSubRow,
    handleOnItemChange,
    onActionClick,
    actionIsDisabled,
    onRowClick,
    onSelectOneRow,
    onTdClick,
    pager,
    t,
    bufItems,
  ]);

  const SortByOptions: Array<ISortOptions> = useMemo(() => {
    return Object.keys(fields)
      .filter((f) => fields[f]?.sorted && !fields[f].column)
      .map((f) =>
        Object({
          label: fields[f]?.label,
          value: f,
          sort: getFieldSort(sort, f),
        })
      );
  }, [fields, sort]);

  const tableBlock = (
    <div
      className={` ${isShadowStyle} ${isOverflowStyle} ${
        className ? className : ""
      } relative`}
    >
      {loaderEntities && <InsetSpinner checkEntities={loaderEntities} />}
      <table className={`w-full ${tableClassName}`}>
        {!noHeader && (
          <thead className="">
            <tr className="">
              {drawSubRow && isFunction(drawSubRow) && <td />}
              {fields &&
                Object.keys(fields)
                  .filter((field) => fields[field].column)
                  .map((f, i) => {
                    return (
                      // @ts-ignore
                      <HeadItem
                        key={`AdaptiveTable_Item_Head_${i}`}
                        headClassName={fields[f].column.headClassName}
                        label={fields[f].label}
                        field={f}
                        fieldType={fields[f].type}
                        sorted={fields[f]?.sorted && !isExternalSort}
                        sort={getFieldSort(sort, f)}
                        isTouchedAll={isTouchedAll}
                        onSortChanged={handleSortEvent}
                        onSelectAllRowClick={onSelectAllRows}
                      />
                    );
                  })}
              {actions?.length > 0 && (
                // @ts-ignore
                <HeadItem
                  key="AdaptiveTable_Item_Head_Action"
                  pagerName={pagerName.toUpperCase()}
                  headClassName={actionHeadClassName}
                  sortBy={SortByOptions}
                  onSortChanged={handleSortEvent}
                  field=""
                />
              )}
              {multiSelectActions && (
                <MultiSelectActions
                  selectedRows={touched}
                  multiSelectActions={multiSelectActions}
                />
              )}
            </tr>
          </thead>
        )}
        <tbody className={`${bodyClassName}`}>{tableRows}</tbody>
      </table>
    </div>
  );

  const WrappedBlock = withRequestResult(() => tableBlock, { pager }) as any;

  return (
    <div className="flex flex-col">
      <div
        className={`w-full relative flex flex-col gap-1 mb-3 items-start lg:flex-row lg:items-center lg:gap-5 lg:mb-[2.188rem] ${tableTitleContainerClassName}`}
      >
        <h2
          className={`font-bold pl-12 text-center text-[1rem] leading-8  text-black text-nowrap lg:text-left lg:text-[1.5rem] lg:pl-0 ${tableTitleClassName}`}
        >
          {tableTitle}
        </h2>
        <div className="w-full flex items-center justify-center lg:justify-end">
          <FilterBar
            pager={pager}
            fields={fields}
            onFilterChanged={
              onFilterChanged ? handleOldFilterEvent : handleFilterEvent
            }
          />
        </div>
        {isExternalSort && (
          <ExternalSort
            onLoadMore={onLoadMore}
            fields={fields}
            pagerName={pagerName}
          />
        )}
        {tableActions && <TableActions tableActions={tableActions} />}
      </div>
      <WrappedBlock />

      {pager && count > 1 && <div className="">{pagination}</div>}
    </div>
  );
}

const getFieldSort = (sort, f) => {
  return sort.field === f ? sort.sort : Sort.none;
};

export default AdaptiveTable;
