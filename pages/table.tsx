import { useActions } from "@/client/hooks/useActions";
import { Actions, FilterType, IFieldList, PaginationType } from "@/client/pagination/IPagerParams";
import AdaptiveTable from "@/components/AdaptiveTable/Table";
import { Null } from "@/components/null";
import { DEFAULT_PER_PAGE } from "@/constants";

const fields: IFieldList = {
	id:{
		label: 'ID',
		sorted: true,
		placeholder: 'ID',
		type: FilterType.Text,
		column:{
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
		}
	},
	firstName:{
		label: 'First Name',
		sorted: false,
		placeholder: 'First Name',
		type: FilterType.Text,
		column:{
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
		}
	},
	lastName:{
		label: 'Last Name',
		sorted: false,
		placeholder: 'Last Name',
		type: FilterType.Text,
		column:{
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
		}
	},
	email:{
		label: 'Email',
		sorted: false,
		placeholder: 'Email',
		type: FilterType.Text,
		column:{
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
		}
	}
}
const fields2: IFieldList = {
	mediaResources: {
		label: "Image",
		sorted: false,
		column: {
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
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
		label: "Machine Model",
		type: FilterType.Text,
		sorted: true,
		placeholder: "Model",
		filter: {
			showLabel: true,
			group: "g1",
			className: "text-gray-900 ",
			inputClassName:
				"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
		},
		column: {
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
		},
	},
	machineType: {
		label: "Machine Type",
		sorted: true,
		column: {
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 first-letter:capitalize text-sm font-medium text-gray-900 sm:pl-6",
		},
	},
	brand: {
		label: "Brand",
		type: FilterType.Text,
		sorted: true,
		placeholder: "Brand",
		filter: {
			showLabel: true,
			group: "g1",
			className: "text-gray-900 ",
			inputClassName:
				"block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
		},
		column: {
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6",
		},
	},
	zones: {
		label: "Zones List",
		sorted: false,
		column: {
			headClassName:
				"bg-gray-50 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 max-w-[200px] whitespace-pre-wrap overflow-auto",
			itemClassName:
				"whitespace-nowrap pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-[200px] whitespace-pre-wrap overflow-auto",
			draw: (data) => {
				data.zones.map((item, indx) => {});
				return (
					<p className="first-letter:capitalize">{data.zones.join(", ")}</p>
				);
			},
		},
	},
};

export default function Page() {
	const {fetchProjectPage} = useActions('UserEntity')
	return (
		<AdaptiveTable
			fields={fields}
			actionClassName="text-gray-500 bg-opacity-50 py-1.5 ring-inset ring-gray-300"
			bodyClassName="divide-y divide-gray-200 bg-white"
			className="overflow-hidden bg-gray-100 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg"
			actions={[Actions.Edit, Actions.Delete]}
			pagerName={"users"}
			perPage={DEFAULT_PER_PAGE}
			onLoadMore={fetchProjectPage}
			// onActionClick={onActionClick}
			loaderEntities={"machines-models"}
		/>
	);
}
