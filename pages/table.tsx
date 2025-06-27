/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMenu } from '@/client/types';
import { useActions } from '@/client/hooks/useActions';
import {
	Actions,
	FilterType,
	IFieldList,
	PaginationType,
} from '@/client/pagination/IPagerParams';
import AdaptiveTable from '@/components/AdaptiveTable/Table';
import { Null } from '@/components/null';
import { DEFAULT_PER_PAGE, UserStatus } from '@/constants';
import container from '@/server/container/container';
import { upperFirst } from 'lodash';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

const statusOptions = Object.values(UserStatus).map((v) => ({
	value: v,
	label: upperFirst(v),
}));

const fields: IFieldList = {
	id: {
		label: 'id-label',
		sorted: true,
		placeholder: 'Id',
		type: FilterType.Text,
		column: {
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
		},
	},

	firstName: {
		label: 'firstName-label',
		sorted: true,
		placeholder: 'First Name',
		type: FilterType.Text,
		column: {
			editable: true,
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
			inputClassName: 'bg-gray-100',
		},
	},
	lastName: {
		label: 'lastName-label',
		sorted: true,
		placeholder: 'Last Name',
		type: FilterType.Text,
		column: {
			editable: true,
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
			inputClassName: 'bg-gray-100',
		},
		filter: {
			showLabel: true,
			group: 'gl',
			className: 'text-gray-900',
			inputClassName:
				'block w-full rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
		},
	},
	email: {
		label: 'email-label',
		sorted: true,
		placeholder: 'Email',
		type: FilterType.Text,
		column: {
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
		},
		filter: {
			showLabel: true,
			group: 'gl',
			className: 'text-gray-900 ',
			inputClassName:
				'block w-full rounded-md border-0 py-1.5 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
		},
	},
	status: {
		label: 'status-label',
		sorted: true,
		placeholder: 'Status',
		type: FilterType.Select,
		column: {
			options: statusOptions,
			editable: true,
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
		},
		filter: {
			options: statusOptions,
			showLabel: true,
			group: 'gl',
			className: 'text-gray-900 ',
			inputClassName:
				'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
		},
	},
};

interface IChanges {
	[id: number]: Record<string, string>;
}

export default function Page() {
	const { fetchUsersPage: fetchProjectPage } = useActions('UserEntity');
	const { fetchUserById: getUserById } = useActions('UserEntity');
	const [changes, setChanges] = useState<IChanges>({});

	const actionsMenu: IMenu = {
	'select-action1': {
		label: 'msAction1',
		onClick: (touched:number[]) => toast('action1:' + JSON.stringify(touched)),
		icon: (
			<svg className="w-6 h-6">
				<circle
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="2"
					fill="none"
				/>
				<path
					d="M8 12h8M12 8v8"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				/>
			</svg>
		),
	},
	'select-action2': {
		label: 'Save',
		onClick: () =>
			toast(
				'action2: saving changes for: ' + JSON.stringify(Object.keys(changes))
			),
	},
};

	function onActionClick(
		action: Actions,
		data: any /*, pagerParams: IPagerParams*/
	) {
		switch (action) {
			case Actions.Edit: {
				toast('Edit action for:' + JSON.stringify(data));
				return;
			}
			case Actions.Delete: {
				toast('Delete action for:' + JSON.stringify(data));
				getUserById({ id: data.id });
				return;
			}
		}
	}

	const handleChanges = useCallback(
		(id: number, field: string, value: string, data?: any) => {
			toast(
				'item changed: ' + JSON.stringify({ id, field, value, data }, null, 2)
			);
			setChanges({
				...changes,
				[id]: {
					...(changes[id] ?? {}),
					[field]: value,
				},
			});
		},
		[changes]
	);

	return (
		<AdaptiveTable
			fields={fields}
			actionClassName="text-gray-500 bg-opacity-50 py-1.5 ring-inset ring-gray-300"
			bodyClassName="divide-y divide-gray-200 bg-white"
			className="overflow-hidden bg-gray-100 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
			actions={[Actions.Edit, Actions.Delete]}
			pagerName={'users'}
			perPage={DEFAULT_PER_PAGE}
			onLoadMore={fetchProjectPage}
			onActionClick={onActionClick}
			loaderEntities={'machines-models'}
			onItemChange={handleChanges}
			typeOfPagination={PaginationType.LIGHT}
			isMultiSelect={true}
			multiSelectActions={actionsMenu}
		/>
	);
}

export const getServerSideProps = container.resolve('getServerSideProps')([]);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fields2: IFieldList = {
	mediaResources: {
		label: 'Image',
		sorted: false,
		column: {
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
			draw: (data) => {
				return (
					<div className="w-[150px]">
						{data.mediaResources && (
							// <ImageStore
							// 	folder={`models/${data?.id}`}
							// 	name={`${data.mediaResources}`}
							// />
							<Null />
						)}
					</div>
				);
			},
		},
	},
	model: {
		label: 'Machine Model',
		type: FilterType.Text,
		sorted: true,
		placeholder: 'Model',
		filter: {
			showLabel: true,
			group: 'g1',
			className: 'text-gray-900 ',
			inputClassName:
				'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
		},
		column: {
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
		},
	},
	machineType: {
		label: 'Machine Type',
		sorted: true,
		column: {
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 first-letter:capitalize text-sm font-medium text-gray-900 sm:pl-6',
		},
	},
	brand: {
		label: 'Brand',
		type: FilterType.Text,
		sorted: true,
		placeholder: 'Brand',
		filter: {
			showLabel: true,
			group: 'g1',
			className: 'text-gray-900 ',
			inputClassName:
				'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
		},
		column: {
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6',
		},
	},
	zones: {
		label: 'Zones List',
		sorted: false,
		column: {
			headClassName:
				'bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-[200px] whitespace-pre-wrap overflow-auto',
			itemClassName:
				'whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-[200px] whitespace-pre-wrap overflow-auto',
			draw: (data) => {
				data.zones.map(() => {});
				return (
					<p className="first-letter:capitalize">{data.zones.join(', ')}</p>
				);
			},
		},
	},
};
