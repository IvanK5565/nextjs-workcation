import { useTranslation } from "react-i18next";

interface ILoadMorePaginatorProps {
  currPage: number;
  perPage: number;
  count: number;
  onLoadMore: (page: number) => void;
}

export default function LoadMorePaginator({
  count,
  currPage,
  onLoadMore,
  perPage,
}: ILoadMorePaginatorProps) {
  const { t } = useTranslation();
  const pageCount = Math.ceil(count / perPage);
  if (pageCount <= 1 || currPage >= pageCount) {
    return null;
  }
  return (
    <div className="flex justify-center mt-2 lg:mt-6">
      <button
        className="rounded-[4.375rem] border border-[#EAEEF4] py-[0.625rem] px-6 text-primary-navy font-inter text-[0.875rem] leading-[1.875rem] font-medium"
        onClick={() => onLoadMore(currPage + 1)}
      >
        {t("load-more")}
      </button>
    </div>
  );
}
