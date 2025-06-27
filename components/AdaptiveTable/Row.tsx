/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMenu } from '@/acl/types';
import get from 'lodash/get';
import has from 'lodash/has';
import {
	forwardRef,
	JSX,
	MouseEvent,
	useCallback,
	useMemo,
	useState,
} from 'react';
import {
	Actions,
	IFieldList,
	IPagerParams,
} from '@/client/pagination/IPagerParams';
import { isFunction } from '@/client/utils/random';
import { FaCaretDown, FaCaretRight } from '../FaIcons/icons';
import ActionItem from './ActionItem';
import ActionMenu from './ActionMenu';
import RowItem from './RowItem';
import { IPaginationInfo } from '@/client/constants';
import { useSelector } from 'react-redux';
import { AppState } from '@/client/store/ReduxStore';

const MAX_COLUMNS_COUNT = 500;
const MAX_ROWS_COUNT = 10;

interface IRowProps {
	data: object;
	id: number;
	actionClassName?: string;
	actionContainerClassName?: string;
	rowClassName?: string;
	columns: IFieldList;
	actions?: Actions[];
	actionMenu?: IMenu;
	pager: IPaginationInfo;
	subRowBackground?: string | boolean;

	drawSubRow?: (data: any) => JSX.Element;
	onActionClick?: (
		action: Actions,
		data: any,
		pagerParams: IPagerParams
	) => void;
	actionIsDisabled?: (action: Actions, data: any) => boolean;

	onRowClick?: (data: any) => void;
	onTdClick?: (field: string, data: any) => void;
	// onSelectOneRow?: (id: string) => void;
	onSelectOneRow?: (id: string) => void;
	onItemChange?: (id: number, value: any, field: string, data?: any) => void;

	isMultiSelect?: boolean;
}
const Row = forwardRef<HTMLTableRowElement, IRowProps>((props, ref) => {
	const {
		id,
		columns,
		actions,
		pager,
		actionClassName,
		rowClassName,
		actionMenu,
		subRowBackground,
		onItemChange,
		onRowClick,
		onActionClick,
		onTdClick,
		drawSubRow,
		actionContainerClassName = '',
		onSelectOneRow,
		actionIsDisabled: isActionActivePredicate,
	} = props;
	const data = useSelector<AppState, object | undefined>(
		(state) => state.entities?.[pager.entityName]?.[id]
	);

	const handleActionClick = useCallback(
		(action: Actions, data: any) => {
			if (isFunction(onActionClick)) {
				const pagerParams: IPagerParams = {
					//@ts-ignore
					pageName: has(pager, 'pageName') ? get(pager, 'pageName') : '',
					//@ts-ignore
					sort: has(pager, 'sort') ? get(pager, 'sort') : {},
					//@ts-ignore
					filter: has(pager, 'filter') ? get(pager, 'filter') : {},
					//@ts-ignore
					page: has(pager, 'currentPage') ? get(pager, 'currentPage') : 1,
					//@ts-ignore
					perPage: has(pager, 'perPage')
						? get(pager, 'perPage')
						: MAX_ROWS_COUNT,
				};

				if (onActionClick) onActionClick(action, data, pagerParams);
			}
		},
		[onActionClick, pager]
	);

	const handleItemChange = useCallback(
		(field: string, value: any, data:any) => {
			if (isFunction(onItemChange)) {
				onItemChange?.(id, field, value, data);
			}
		},
		[id, onItemChange]
	);

	const className = onRowClick ? rowClassName : '';

	const _actionClassName = useMemo(
		() =>
			actionClassName
				? actionClassName
				: 'flex flex-row justify-end items-center space-x-2 table-icons-row',
		[actionClassName]
	);

	const isSubRowEnabled = drawSubRow && isFunction(drawSubRow);
	const subRowContent = isSubRowEnabled && drawSubRow(data);

	const columnsElement = useMemo(() => {
		return (
			columns &&
			Object.keys(columns)
				.filter((field) => columns[field].column)
				.map((f, i) => (
					<RowItem
						key={`AdaptiveTable_Item_Row_${i}`}
						//@ts-ignore
						data={data}
						field={f}
						columns={columns}
						onTdClick={onTdClick}
						pager={pager}
						onSelectOneRow={onSelectOneRow}
						onItemChange={handleItemChange}
					/>
				))
		);
	}, [columns, data, handleItemChange, onSelectOneRow, onTdClick, pager]);

	const [subRowOpen, setSubRowOpen] = useState<boolean>(false);

	const closeOpenSubRow = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation();
			setSubRowOpen(!subRowOpen);
		},
		[subRowOpen]
	);

	const subRowArrow = useMemo(() => {
		if (subRowContent) {
			return (
				<td className="sub-row-arrow-container" onClick={closeOpenSubRow}>
					<div className="sub-row-arrow">
						{subRowOpen ? (
							<FaCaretDown style={{ color: subRowBackground }} />
						) : (
							<FaCaretRight />
						)}
					</div>
				</td>
			);
		} else {
			return (
				<td>
					<div></div>
				</td>
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [closeOpenSubRow, subRowOpen, subRowContent]);

	const actionsElement = useMemo(() => {
		if (!!actions || !!actionMenu) {
			return (
				<td
					key="AdaptiveTable_Item_Row_Action"
					className={`h-full ${actionContainerClassName}`}
				>
					<div className={_actionClassName}>
						{actions?.map((a, i) => (
							<ActionItem
								key={'AdaptiveTable_Row_Action_' + i}
								data={data}
								action={a}
								actionIsDisabled={isActionActivePredicate}
								onActionClick={handleActionClick}
							/>
						))}

						{actionMenu && (
							<ActionMenu menu={actionMenu} item={data} data={data} />
						)}
					</div>
				</td>
			);
		}
	}, [
		actions,
		_actionClassName,
		actionMenu,
		data,
		actionContainerClassName,
		isActionActivePredicate,
		handleActionClick,
	]);

	const handleRowClick = useCallback(
		(e: any) => {
			e?.stopPropagation?.();
			if (onRowClick && isFunction(onRowClick)) {
				onRowClick(data);
			}
		},
		[data, onRowClick]
	);

	const nowOpen = useMemo(
		() => (subRowOpen ? 'border-b bg-blueLight-100' : ''),
		[subRowOpen]
	);
	const nowOpenStyle = useMemo(() => {
		return subRowOpen && subRowBackground
			? {
					backgroundColor: subRowBackground + '11',
					borderLeft: `5px solid ${subRowBackground}`,
			  }
			: {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [subRowOpen]);

	return (
		<>
			<tr
				ref={ref}
				onClick={handleRowClick}
				style={nowOpenStyle}
				className={`${className} ${nowOpen} `}
			>
				{isSubRowEnabled && subRowArrow}
				{columnsElement}
				{actionsElement}
			</tr>

			{subRowContent && subRowOpen && (
				<tr className={`${className}`}>
					<td colSpan={MAX_COLUMNS_COUNT} style={nowOpenStyle}>
						{subRowContent}
					</td>
				</tr>
			)}
		</>
	);
});

Row.displayName = 'Row'; // Required when using forwardRef

export default Row;
