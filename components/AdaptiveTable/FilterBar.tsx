/* eslint-disable @typescript-eslint/no-explicit-any */
import get from "lodash/get";
import { JSX, useCallback, useEffect, useMemo, useState } from "react";

import { IPaginationInfo } from "@/client/constants";
import { isEmpty } from "@/client/utils/random";
import { IFieldList } from "@/client/pagination/IPagerParams";
import FilterItem from "./FilterItem";

export interface IFilterBarProps {
  className?: string;
  fields: IFieldList;
  pager?: IPaginationInfo;
  onFilterChanged: (field: string, value: string) => void;
}

export default function FilterBar(props: IFilterBarProps) {
  const { fields, pager, onFilterChanged, className } = props;
  const _className = useMemo(() => (className ? className : ""), [className]);

  const getFieldInitialValue = useCallback(
    (fieldname: string) => {
      const filter = get(pager, "filter");
      const initvalue = filter && filter[fieldname];
      return initvalue ? initvalue : "";
    },
    [pager]
  );
  const [filterItems, setFilterItems] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (isEmpty(fields)) {
      return;
    }
    setFilterItems(
      Object.entries(
        Object.keys(fields)
          .filter((field) => Boolean(fields[field]?.filter))
          .reduce(
            (r, v, i, a, k = fields[v].filter!.group) => (
              (r[k] || (r[k] = [])).push(v), r
            ),
            {} as {[key:string]:string[]}
          )
      ).map((pair) => {
        return (
          <div
            key={"AdaptiveTable_Filter_Row_" + pair[0]}
            className="flex flex-col flex-wrap content-center gap-4 px-4 items-center lg:flex-row"
          >
            {Object.values(pair[1]).map((field, j) => {
              return (
                <FilterItem
                  key={`AdaptiveTable_Filter_Field_${j}`}
                  className={fields[field].filter?.className}
                  labelClassName={fields[field].filter?.labelClassName}
                  inputClassName={fields[field].filter?.inputClassName}
                  activeClassName={fields[field].filter?.activeClassName}
                  label={
                    fields[field].filter?.customLabel ?? fields[field].label
                  }
                  iconPosition={fields[field].filter?.iconPosition}
                  type={fields[field].type!}
                  icon={fields[field].filter!.icon}
                  name={field}
                  showLabel={fields[field].filter!.showLabel}
                  options={fields[field].filter!.options}
                  placeholder={fields[field].placeholder ?? ''}
                  value={getFieldInitialValue(field)}
                  onFilterChanged={onFilterChanged}
                  onSearch={fields[field].filter!.onSearch}
                  debounceTime={fields[field].filter!.debounceTime}
                  minSearchLength={fields[field].filter!.minSearchLength}
                  disabled={fields[field].filter!.disabled}
                  isImmediatelyChange={fields[field].filter!.isImmediatelyChange}
                  additionalLabel={fields[field].filter!.additionalLabel}
                  isLocalSearch={fields[field].filter!.isLocalSearch}
                />
              );
            })}
          </div>
        );
      })
    );
  }, [fields, getFieldInitialValue, onFilterChanged]);

  const isHaveFilterItems = filterItems.length;
  return (
    <>
      {isHaveFilterItems ? (
        <div className={`${_className} sm:flex flex-col`}>{filterItems}</div>
      ) : (
        ""
      )}
    </>
  );
}
