/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useMemo, useCallback} from 'react';
import Checkbox from './Inputs/CheckElements/CheckBox';
import {Sort, FilterType} from '@/client/pagination/IPagerParams';
import {useTranslation} from 'react-i18next';
import {isFunction} from '@/client/utils/random';
import SortBy, {GetNextSort, GetSortIcon, ISortOptions} from './SortBy';

export interface IHeadItemProps {
    pagerName: string;
    field: string;
    fieldType?: FilterType;
    label?: string;
    headClassName?: string;
    sorted?: boolean;
    dir: Sort;
    sortBy?: Array<ISortOptions>;
    onSortChanged?: (field: string, dir: Sort) => void;
    onSelectAllRowClick?: () => void;
    isTouchedAll?: boolean;
}

export interface IHeadItemState {
    reactIcon: any;
}
export default function HeadItem(props: IHeadItemProps) {
    const {
        field,
        label,
        pagerName,
        headClassName,
        fieldType,
        isTouchedAll,
        sorted,
        dir,
        sortBy,
        onSortChanged,
        onSelectAllRowClick,
    } = props;
    const {t} = useTranslation();

    const handleChange = useCallback(() => {
        if (isFunction(onSelectAllRowClick)) {
            onSelectAllRowClick?.();
        }
    }, [onSelectAllRowClick]);

    const changeSort = useCallback(
        (field: string, dir: Sort) => {
            if (isFunction(onSortChanged)) {
                onSortChanged?.(field, GetNextSort(dir));
            }
        },
        [onSortChanged],
    );

    const handleSortClick = useCallback(() => {
        if (sorted) {
            changeSort(field, dir);
        }
    }, [changeSort, field, dir, sorted]);

    const activeSort =
        sorted && dir !== Sort.none ? 'text-gray-600' : 'text-gray-400';
    const sortedStyle = sorted ? 'cursor-pointer' : '';
    const sortIcon = useMemo(
        () => GetSortIcon(dir, 'transform hover:scale-125'),
        [dir],
    );
    const isTouched = fieldType === FilterType.Touche && Boolean(onSelectAllRowClick);

    const SortByOptions = useMemo(() => {
        if (sortBy) {
            return (
                <SortBy
                    idSortBy={pagerName}
                    changeSort={changeSort}
                    options={sortBy}
                />
            );
        }
    }, [changeSort, pagerName, sortBy]);
    return (
        <th className={`${headClassName ? headClassName : ''}`}>
            <div className={`flex flex-row justify-start items-center`}>
                {isTouched && (
                    <Checkbox checked={!!isTouchedAll} onChange={handleChange} />
                )}
                {typeof label === 'string' ? (
                    <p className="whitespace-nowrap"> {t(label)} </p>
                ) : (
                    label
                )}
                {sorted && (
                    <div
                        onClick={handleSortClick}
                        className={`pl-2 ${sortedStyle}`}>
                        {' '}
                        {sortIcon}{' '}
                    </div>
                )}
                <div className={`${activeSort}`}>{SortByOptions}</div>
            </div>
        </th>
    );
}
