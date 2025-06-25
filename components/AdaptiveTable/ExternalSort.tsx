import { PagerName, usePageSelector } from "@/client/hooks/usePageSelector";
import { IFieldList, Sort } from "@/client/pagination/IPagerParams";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import Select from "./Inputs/Select";

interface IExternalSortProps {
  pagerName: PagerName;
  fields: IFieldList;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onLoadMore?: (loadParams: any) => void;
}

export default function ExternalSort({
  fields,
  pagerName,
  onLoadMore,
}: IExternalSortProps) {
  const { t } = useTranslation();
  const pager = usePageSelector(pagerName);
  const onSortChange = useCallback(
    (name: string, value: string) => {
      const preparedData = {
        sort: { field: value, dir: Sort.ASC },
        force: true,
        perPage: pager?.perPage,
        pageName: pagerName,
      };
      onLoadMore?.(preparedData);
    },
    [onLoadMore, pager, pagerName]
  );

  const currentValue = useMemo(() => {
    const sortField = pager?.sort?.[0];
    if (sortField) {
      return sortField?.field;
    }
    return "createdAt";
  }, [pager]);

  const sortOptions = useMemo(() => {
    const filedOptions = Object.entries(fields)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ?.filter(([key, field]) => !!field?.sorted)
      .map(([key, field]) => ({
        label: field.label,
        value: key,
      }));
    filedOptions?.push({
      label: t("createdAt"),
      value: "createdAt",
    });
    return filedOptions;
  }, [fields, t]);

  return (
    <div className="min-w-[14.688rem] w-full max-w-[20rem]">
      <Select
        className="bg-white !py-[0.563rem] !text-[0.875rem] !text-primary-navy leading-[1.875rem] !px-7 rounded-[1.875rem] border border-[#EAEEF4]"
        items={sortOptions}
        chevronContainerClassName="!right-6"
        chevronClassName="!w-[1.125rem] !h-2"
        name={pagerName}
        needPlaceholder={false}
        onChange={onSortChange}
        value={currentValue}
        placeholder=""
        additionalText={t("sort-by") + ": "}
      />
    </div>
  );
}
